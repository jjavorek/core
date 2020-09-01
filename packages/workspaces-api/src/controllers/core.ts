import { Bridge } from "../communication/bridge";
import { WorkspacesController } from "../types/controller";
import { Glue42Workspaces } from "../../workspaces";
import { RefreshChildrenConfig } from "../types/privateData";
import { AddItemResult, WorkspaceSnapshotResult, FrameSnapshotResult, IsWindowInSwimlaneResult, WorkspaceCreateConfigProtocol, FrameSummaryResult, WorkspaceSummariesResult } from "../types/protocol";
import { Child } from "../types/builders";
import { CoreFrameUtils } from "../communication/core-frame-utils";
import { OPERATIONS } from "../communication/constants";
import { Workspace } from "../models/workspace";
import { LayoutsAPI, Instance, GDWindow } from "../types/glue";
import { BaseController } from "./base";

export class CoreController implements WorkspacesController {
    constructor(
        private readonly bridge: Bridge,
        private readonly frameUtils: CoreFrameUtils,
        private readonly layouts: LayoutsAPI,
        private readonly base: BaseController
    ) { }

    public async checkIsInSwimlane(windowId: string): Promise<boolean> {

        const allFrames = this.frameUtils.getAllFrameInstances();

        if (!allFrames.length) {
            return false;
        }

        const allResults = await Promise
            .all(allFrames.map((frameInstance) => this.bridge.send<IsWindowInSwimlaneResult>(OPERATIONS.isWindowInWorkspace.name, { itemId: windowId }, frameInstance)));

        return allResults.some((result) => result.inWorkspace);
    }

    public async createWorkspace(definition: Glue42Workspaces.WorkspaceDefinition, saveConfig?: Glue42Workspaces.WorkspaceCreateConfig): Promise<Workspace> {
        const createConfig: WorkspaceCreateConfigProtocol = Object.assign({}, definition, { saveConfig });

        const frameInstanceConfig = {
            frameId: definition.frame?.reuseFrameId,
            newFrame: definition.frame?.newFrame
        };

        const frameInstance = await this.frameUtils.getFrameInstance(frameInstanceConfig);

        const workspace = await this.base.createWorkspace(createConfig, frameInstance);

        await this.frameUtils.focusFrame(frameInstance);

        return workspace;
    }

    public async restoreWorkspace(name: string, options?: Glue42Workspaces.RestoreWorkspaceConfig): Promise<Workspace> {
        const allLayouts = await this.getLayoutSummaries();

        const layoutExists = allLayouts.some((summary) => summary.name === name);

        if (!layoutExists) {
            throw new Error(`This layout: ${name} cannot be restored, because it doesn't exist.`);
        }

        const frameInstance: Instance = await this.frameUtils.getFrameInstance({ frameId: options?.frameId, newFrame: options?.newFrame });

        const workspace = await this.base.restoreWorkspace(name, options, frameInstance);
        
        await this.frameUtils.focusFrame(frameInstance);

        return workspace;
    }

    public async add(type: "container" | "window", parentId: string, parentType: "row" | "column" | "group" | "workspace", definition: Glue42Workspaces.WorkspaceWindowDefinition | Glue42Workspaces.BoxDefinition): Promise<AddItemResult> {

        const frameInstance = await this.frameUtils.getFrameInstanceByItemId(parentId);

        return await this.base.add(type, parentId, parentType, definition, frameInstance);
    }

    public async processLocalSubscription(): Promise<Glue42Workspaces.Unsubscribe> {
        throw new Error("Workspaces events are not supported in Glue42 Core.");
    }

    public async processGlobalSubscription(): Promise<Glue42Workspaces.Unsubscribe> {
        throw new Error("Workspaces events are not supported in Glue42 Core.");
    }

    public async getFrame(selector: { windowId?: string; predicate?: (frame: Glue42Workspaces.Frame) => boolean }): Promise<Glue42Workspaces.Frame> {

        if (selector.windowId) {
            const frameInstance = await this.frameUtils.getFrameInstanceByItemId(selector.windowId);

            return await this.base.getFrame(selector.windowId, frameInstance);
        }

        if (selector.predicate) {
            return (await this.getFrames(selector.predicate))[0];
        }

        throw new Error(`The provided selector is not valid: ${JSON.stringify(selector)}`);

    }

    public async getFrames(predicate?: (frame: Glue42Workspaces.Frame) => boolean): Promise<Glue42Workspaces.Frame[]> {

        const allFrameInstances = this.frameUtils.getAllFrameInstances();

        const allFrameSummaries = await Promise.all(allFrameInstances.map((frame) => this.bridge.send<FrameSummaryResult>(OPERATIONS.getFrameSummary.name, { itemId: frame.peerId }, frame)));

        return this.base.getFrames(allFrameSummaries, predicate);
    }

    public async getWorkspace(predicate: (workspace: Workspace) => boolean): Promise<Workspace> {
        let foundWorkspace: Workspace;

        await this.iterateWorkspaces((wsp, end) => {
            if (predicate(wsp)) {
                foundWorkspace = wsp;
                end();
            }
        });

        return foundWorkspace;
    }

    public async getWorkspaces(predicate?: (workspace: Workspace) => boolean): Promise<Workspace[]> {
        const matchingWorkspaces: Workspace[] = [] as Workspace[];

        await this.iterateWorkspaces((wsp) => {
            if (!predicate || predicate(wsp)) {
                matchingWorkspaces.push(wsp);
            }
        });

        return matchingWorkspaces;
    }

    public async getAllWorkspaceSummaries(): Promise<Glue42Workspaces.WorkspaceSummary[]> {
        const allFrames = this.frameUtils.getAllFrameInstances();

        const allResults = await Promise.all(allFrames.map((frame) => this.bridge.send<WorkspaceSummariesResult>(OPERATIONS.getAllWorkspacesSummaries.name, {}, frame)));

        return this.base.getAllWorkspaceSummaries(...allResults);
    }

    public async getWindow(predicate: (swimlaneWindow: Glue42Workspaces.WorkspaceWindow) => boolean): Promise<Glue42Workspaces.WorkspaceWindow> {
        let resultWindow: Glue42Workspaces.WorkspaceWindow;

        await this.iterateWorkspaces((wsp, end) => {
            const foundWindow = wsp.getWindow(predicate);

            if (foundWindow) {
                resultWindow = foundWindow;
                end();
            }
        });

        return resultWindow;
    }

    public async getParent(predicate: (parent: Glue42Workspaces.WorkspaceBox) => boolean): Promise<Glue42Workspaces.WorkspaceBox> {
        let resultParent: Glue42Workspaces.WorkspaceBox;

        await this.iterateWorkspaces((wsp, end) => {
            const foundParent = wsp.getBox(predicate);

            if (foundParent) {
                resultParent = foundParent;
                end();
            }
        });

        return resultParent;
    }

    public async getLayoutSummaries(): Promise<Glue42Workspaces.WorkspaceLayoutSummary[]> {
        const layouts = await this.layouts.getAll("Workspace");
        return layouts.map((layout) => {
            return {
                name: layout.name
            };
        });
    }

    public async deleteLayout(name: string): Promise<void> {
        await this.layouts.remove("Workspace", name);
    }

    public async exportLayout(predicate?: (layout: Glue42Workspaces.WorkspaceLayout) => boolean): Promise<Glue42Workspaces.WorkspaceLayout[]> {
        const allLayouts = await this.layouts.export("Workspace");

        return allLayouts.reduce<Glue42Workspaces.WorkspaceLayout[]>((matchingLayouts, layout) => {

            if (!predicate || predicate(layout)) {
                matchingLayouts.push(layout);
            }

            return matchingLayouts;
        }, []);
    }

    public async importLayout(layouts: Glue42Workspaces.WorkspaceLayout[]): Promise<void> {
        await this.layouts.import(layouts);
    }

    public async saveLayout(config: Glue42Workspaces.WorkspaceLayoutSaveConfig): Promise<Glue42Workspaces.WorkspaceLayout> {

        const framesCount = this.frameUtils.getAllFrameInstances().length;

        if (!framesCount) {
            throw new Error(`Cannot save the layout with config: ${JSON.stringify(config)}, because no active frames were found`);
        }

        const frameInstance = await this.frameUtils.getFrameInstanceByItemId(config.workspaceId);

        return await this.bridge.send<Glue42Workspaces.WorkspaceLayout>(OPERATIONS.saveLayout.name, { name: config.name, workspaceId: config.workspaceId }, frameInstance);
    }

    public async bundleTo(type: "row" | "column", workspaceId: string): Promise<void> {
        const frameInstance = await this.frameUtils.getFrameInstanceByItemId(workspaceId);

        return await this.base.bundleTo(type, workspaceId, frameInstance);
    }

    public getWorkspaceContext(workspaceId: string): Promise<any> {
        return this.base.getWorkspaceContext(workspaceId);
    }

    public setWorkspaceContext(workspaceId: string, data: any): Promise<void> {
        return this.base.setWorkspaceContext(workspaceId, data);
    }

    public updateWorkspaceContext(workspaceId: string, data: any): Promise<void> {
        return this.base.updateWorkspaceContext(workspaceId, data);
    }

    public subscribeWorkspaceContextUpdated(workspaceId: string, callback: (data: any) => void): Promise<import("callback-registry").UnsubscribeFunction> {
        return this.base.subscribeWorkspaceContextUpdated(workspaceId, callback);
    }

    public async restoreItem(itemId: string): Promise<void> {
        const frameInstance = await this.frameUtils.getFrameInstanceByItemId(itemId);

        await this.base.restoreItem(itemId, frameInstance);
    }

    public async maximizeItem(itemId: string): Promise<void> {
        const frameInstance = await this.frameUtils.getFrameInstanceByItemId(itemId);

        await this.base.maximizeItem(itemId, frameInstance);
    }

    public async focusItem(itemId: string): Promise<void> {
        const frameInstance = await this.frameUtils.getFrameInstanceByItemId(itemId);

        await this.base.focusItem(itemId, frameInstance);
    }

    public async closeItem(itemId: string, frame?: Glue42Workspaces.Frame): Promise<void> {
        const frameInstance = await this.frameUtils.getFrameInstanceByItemId(itemId);

        const isItemFrame = itemId === frameInstance.peerId;

        await this.base.closeItem(itemId, frameInstance);

        if (isItemFrame) {
            return await this.frameUtils.closeFrame(frameInstance);
        }

        if (frame) {
            return await frame.close();
        }
    }

    public async resizeItem(itemId: string, config: Glue42Workspaces.ResizeConfig): Promise<void> {
        const frameInstance = await this.frameUtils.getFrameInstanceByItemId(itemId);

        await this.base.resizeItem(itemId, config, frameInstance);

        await this.frameUtils.resizeFrame(itemId, config);
    }

    public async moveFrame(itemId: string, config: Glue42Workspaces.MoveConfig): Promise<void> {
        const frameInstance = await this.frameUtils.getFrameInstanceByItemId(itemId);

        await this.base.moveFrame(itemId, config, frameInstance);

        await this.frameUtils.moveFrame(itemId, config);
    }

    public getGDWindow(itemId: string): GDWindow {
        return this.base.getGDWindow(itemId);
    }

    public async forceLoadWindow(itemId: string): Promise<string> {
        const frameInstance = await this.frameUtils.getFrameInstanceByItemId(itemId);

        return await this.base.forceLoadWindow(itemId, frameInstance);
    }

    public async ejectWindow(itemId: string): Promise<void> {
        const frameInstance = await this.frameUtils.getFrameInstanceByItemId(itemId);

        return await this.base.ejectWindow(itemId, frameInstance);
    }

    public async moveWindowTo(itemId: string, newParentId: string): Promise<void> {
        const frameInstance = await this.frameUtils.getFrameInstanceByItemId(itemId);

        return await this.base.moveWindowTo(itemId, newParentId, frameInstance);
    }

    public async getSnapshot(itemId: string, type: "workspace" | "frame"): Promise<WorkspaceSnapshotResult | FrameSnapshotResult> {
        const frameInstance = await this.frameUtils.getFrameInstanceByItemId(itemId);

        return await this.base.getSnapshot(itemId, type, frameInstance);
    }

    public async setItemTitle(itemId: string, title: string): Promise<void> {
        const frameInstance = await this.frameUtils.getFrameInstanceByItemId(itemId);

        return await this.base.setItemTitle(itemId, title, frameInstance);
    }

    public refreshChildren(config: RefreshChildrenConfig): Child[] {
        return this.base.refreshChildren(config);
    }

    public iterateFindChild(children: Child[], predicate: (child: Child) => boolean): Child {
        return this.base.iterateFindChild(children, predicate);
    }

    public iterateFilterChildren(children: Child[], predicate: (child: Child) => boolean): Child[] {
        return this.base.iterateFilterChildren(children, predicate);
    }

    private async iterateWorkspaces(callback: (workspace: Workspace, end: () => void) => void): Promise<void> {
        let ended = false;

        const end = (): void => { ended = true; };

        const workspaceSummaries = await this.getAllWorkspaceSummaries();

        for (const summary of workspaceSummaries) {
            if (ended) {
                return;
            }

            const frameInstance = await this.frameUtils.getFrameInstance({ frameId: summary.frameId });

            const wsp = await this.base.fetchWorkspace(summary.id, frameInstance);

            callback(wsp, end);
        }
    }
}