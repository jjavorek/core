/* eslint-disable @typescript-eslint/no-explicit-any */

export type WorkspacesFactoryFunction = (glue: any, config?: any) => Promise<void>;
declare const WorkspacesFactory: WorkspacesFactoryFunction;
export default WorkspacesFactory;

/**
 * @docmenuorder 1
 * @docName Workspaces
 * @intro
 * The **Workspaces API** enables advanced window management functionalities. Using Workspaces, users are able to arrange multiple applications within the same visual window (called **Frame**). This arrangement can be performed programmatically or by dragging and dropping applications within the Frame. Users can also save Workspace layouts and restore them within the same Frame or even in different Frames.
 *
 * The Glue42 Workspaces enable the users to compose a custom arrangement of applications by treating each application as an individual building block that can be added, removed, moved or resized within the unifying Frame. The Frame can hold multiple Workspaces (as tabs) and can also be maximized, minimized or resized. 
 *
 * See also the [**Workspaces**](../../../../core/capabilities/interop/workspaces/index.html) documentation for more details.
 */
export namespace Glue42Workspaces {

    /** An object describing a workspace layout. */
    export interface WorkspaceLayout {
        /** An unique string name and identifier of the layout */
        name: string;

        /** The type of the workspace element. */
        type: "Workspace";

        /** The components of the workspace layout. This collection can contain only one element and it must be a workspace component. */
        components: Array<WorkspaceComponent>;

        /** An object containing various layout metadata. */
        metadata?: any;
    }

    /** An object describing a workspace definition in a workspace layout. */
    export interface WorkspaceComponent {
        /** The type of the workspace element. */
        type: "Workspace";

        state: {
            /** An array of all the workspace's children. */
            children: Array<RowLayoutItem | ColumnLayoutItem | GroupLayoutItem | WindowLayoutItem>;

            /** An object containing various element settings. */
            config: any;
        };
    }

    /** An object describing a row definition in a workspace layout. */
    export interface RowLayoutItem {
        /** The type of the workspace element. */
        type: "row";

        /** An array of all the row's children. */
        children: Array<RowLayoutItem | ColumnLayoutItem | GroupLayoutItem | WindowLayoutItem>;

        /** An object containing various element settings. */
        config: any;
    }

    /** An object describing a column definition in a workspace layout. */
    export interface ColumnLayoutItem {
        /** The type of the workspace element. */
        type: "column";

        /** An array of all the column's children. */
        children: Array<RowLayoutItem | ColumnLayoutItem | GroupLayoutItem | WindowLayoutItem>;

        /** An object containing various element settings. */
        config: any;
    }

    /** An object describing a group definition in a workspace layout. */
    export interface GroupLayoutItem {
        /** The type of the workspace element. */
        type: "group";

        /** An array of all the group's children which can only of type window. */
        children: WindowLayoutItem[];

        /** An object containing various element settings. */
        config: any;
    }

    /** An object describing a window definition in a workspace layout. */
    export interface WindowLayoutItem {
        /** The type of the workspace element. */
        type: "window";
        /** A configuration object for the window layout */
        config: {
            /** The name of the application as defined in Glue Desktop */
            appName: string;
            /** The url of the window, in case it is not a defined as an application. */
            url?: string;
        };
    }

    /** A function which when called unsubscribes the user from further notifications. */
    export type Unsubscribe = () => void;

    /** An object containing all the possible settings when restoring a workspace from a layout. */
    export interface RestoreWorkspaceConfig {
        /** An object which will be set as the window context of all windows inside this workspace. */
        context?: object;

        /** The title of the new workspace. */
        title?: string;

        /** A string id of an existing frame. If provided, this workspace will be opened in that specific frame */
        frameId?: string;

        /** A setting used to declare that the workspace must be in a new frame and also provide options for that new frame */
        newFrame?: NewFrameConfig | boolean;
    }

    /** An object describing the possible settings when defining a new frame. */
    export interface NewFrameConfig {
        /** An object describing the possible settings when defining a new frame. */
        bounds?: { top?: number; left?: number; width?: number; height?: number };
    }

    /** An object defining the resize parameters of a frame. */
    export interface ResizeConfig {
        /** The targeted width value */
        width?: number;

        /** The targeted height value */
        height?: number;

        /** Toggles whether or not the provided width and height values should be treated as absolute or relative to the current values. */
        relative?: boolean;
    }

    /** An object defining the position parameters of a frame. */
    export interface MoveConfig {
        /** The targeted top value */
        top?: number;

        /** The targeted left value */
        left?: number;

        /** Toggles whether or not the provided top and left values should be treated as absolute or relative to the current values. */
        relative?: boolean;
    }

    /** An object containing settings applied when creating a new workspace. */
    export interface WorkspaceCreateConfig {
        /** A boolean which defines whether or not the workspace should also be saved as a layout when created. */
        saveLayout?: boolean;
    }

    /** The restore strategy used to open new workspaces from existing layouts. */
    export type RestoreType = "direct" | "delayed" | "lazy";

    /** An object which represent a workspace element. This is an element can be a parent or a workspace window. */
    export type WorkspaceElement = WorkspaceParent | WorkspaceWindow;

    /** An object which represent a workspace parent. This is an element which contains other elements, called children. */
    export type WorkspaceParent = Row | Column | Group;

    /** An object describing the options of the builder. */
    export interface BuilderConfig {
        /** A string defining the type of the builder. */
        type: "workspace" | "row" | "column" | "group";

        /** An object describing various options when creating a builder. */
        definition?: WorkspaceDefinition | ParentDefinition;
    }

    /** Workspace-specific options. */
    export interface WorkspaceConfig {
        /** A title of the workspace. */
        title?: string;

        /** Position of the workspace in relation to it's siblings in the frame. */
        position?: number;

        /** States whether or not the workspace should have focus when opened. */
        isFocused?: boolean;
    }

    /** An object describing the possible options when defining a new workspace */
    export interface WorkspaceDefinition {
        /** An array of all the workspace's children which will also be opened. */
        children?: Array<WorkspaceWindowDefinition | ParentDefinition>;

        /** An object which will be set as the window context of all windows inside this workspace. */
        context?: any;

        /** Workspace-specific options. */
        config?: WorkspaceConfig;

        /** Options regarding the frame where this workspace will be opened in. */
        frame?: {
            /** A string id of an existing frame. If provided, this workspace will be opened in that specific frame */
            reuseFrameId?: string;

            /** A setting used to declare that the workspace must be in a new frame and also provide options for that new frame */
            newFrame?: NewFrameConfig | boolean;
        };
    }

    /** An object describing the possible options when opening a parent inside a workspace. */
    export interface ParentDefinition {
        /** The type of the workspace element. */
        type?: "column" | "row" | "group";

        /** An array of all the parent's children which will also be opened. */
        children?: Array<WorkspaceWindowDefinition | ParentDefinition>;
    }

    /** An object describing the possible options when opening a window inside a workspace. */
    export interface WorkspaceWindowDefinition {
        /** The type of the workspace element. */
        type?: "window";

        /** The name of the application as defined, which will be opened. */
        appName?: string;

        /** The window id of an existing standalone window, which will be dragged into the workspace. */
        windowId?: string;
    }

    /** An object describing the basic details of a frame */
    export interface FrameSummary {
        /** An unique string identifier of the frame */
        id: string;
    }

    /** An object describing the basic details of a workspace */
    export interface WorkspaceSummary {
        /** An unique string identifier of the workspace */
        id: string;

        /** The string id of the frame containing this workspace */
        frameId: string;

        /** The position of this workspace regarding it's siblings */
        positionIndex: number;

        /** The title of the workspace */
        title: string;
    }

    /** An object describing the basic details of a workspace window */
    export interface WorkspaceWindowSummary {
        /** An unique string identifier of the window */
        id: string | undefined;

        /** The type of the workspace element */
        type: "window";

        /** The string id of the frame containing this window */
        frameId: string;

        /** The application name of the window if it was registered as an application */
        appName: string;

        /** The string id of the workspace containing this window */
        workspaceId: string;

        /** The position of this window regarding it's siblings */
        positionIndex: number;

        /** A flag showing whether or not the window is maximized within it's parent */
        isMaximized: boolean;

        /** A flag showing whether or not the window's content is loaded */
        isLoaded: boolean;

        /** A flag showing whether or not the window has focus */
        focused: boolean;

        /** The title of the window */
        title: string;
    }

    /** An object describing a workspace layout without the underlying structure */
    export interface WorkspaceLayoutSummary {
        /** An unique string name and identifier of the layout */
        name: string;
    }

    /** An object describing a frame */
    export interface Frame extends FrameSummary {
        /**
         * Changes the size of this frame.
         * @param config An object defining the resize parameters.
         */
        resize(config: ResizeConfig): Promise<void>;

        /**
         * Changes the position of this frame.
         * @param config An object defining the position parameters.
         */
        move(config: MoveConfig): Promise<void>;

        /**
         * Focuses this frame.
         */
        focus(): Promise<void>;

        /**
         * Closes this frame.
         */
        close(): Promise<void>;

        /**
         * Returns an object detailing the current state of this frame.
         */
        snapshot(): Promise<FrameSnapshot>;

        /**
         * Returns a collection of all workspaces present in this frame.
         */
        workspaces(): Promise<Workspace[]>;

        /**
         * Opens a new workspace in this frame by restoring a previously saved workspace layout.
         * @param name The name of a saved workspace layout, which will be restored.
         * @param options An optional object containing various workspace restore options.
         */
        restoreWorkspace(name: string, options?: RestoreWorkspaceConfig): Promise<Workspace>;

        /**
         * Opens a new workspace in this frame based on the provided definition.
         * @param definition An object describing the shape and options of the workspace.
         * @param saveConfig An object used to set various create options.
         */
        createWorkspace(definition: WorkspaceDefinition, config?: WorkspaceCreateConfig): Promise<Workspace>;

        /**
         * Notifies when this frame is about to close.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event.
         */
        onClosing(callback: (frame: Frame) => void): Promise<Unsubscribe>;

        /**
         * Notifies when this frame is closed.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event.
         */
        onClosed(callback: (closed: { frameId: string }) => void): Promise<Unsubscribe>;

        /**
         * Notifies when this frame either gained or lost focus.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event.
         */
        onFocusChange(callback: (frame: Frame) => void): Promise<Unsubscribe>;

        /**
         * Notifies when a new workspace was opened in this frame and returns an unsubscribe function.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event. Receives the added workspace as a parameter.
         */
        onWorkspaceOpened(callback: (workspace: Workspace) => void): Promise<Unsubscribe>;

        /**
         * Notifies when a workspace present in this frame is about to be closed and returns an unsubscribe function.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event. Receives the workspace as a parameter.
         */
        onWorkspaceClosing(callback: (workspace: Workspace) => void): Promise<Unsubscribe>;

        /**
         * Notifies when a workspace present in this frame was closed and returns an unsubscribe function.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event. Receives an object with the closed workspace id and frame id as a parameter.
         */
        onWorkspaceClosed(callback: (closed: { frameId: string; workspaceId: string }) => void): Promise<Unsubscribe>;

        /**
         * Notifies when a change in the workspace focus in this frame has happened and returns an unsubscribe function.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event. Receives the workspace which now has focus as a parameter.
         */
        onWorkspaceFocusChange(callback: (workspace: Workspace) => void): Promise<Unsubscribe>;

        /**
         * Notifies when a new window was added to a workspace part of this frame and returns an unsubscribe function.
         * An added window means that the window has a place in the workspace (it is a valid workspace element), but does not guarantee that the contents of the window are loaded.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event. Receives the added window as a parameter.
         */
        onWindowAdded(callback: (window: WorkspaceWindow) => void): Promise<Unsubscribe>;

        /**
         * Notifies when a window was removed from a workspace part of this frame and returns an unsubscribe function.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event. Receives an object containing the ids of the removed window, and the respective workspace and frame as a parameter.
         */
        onWindowRemoved(callback: (removed: { windowId?: string; workspaceId: string; frameId: string }) => void): Promise<Unsubscribe>;

        /**
         * Notifies when a window's content was loaded in a workspace part of this frame and returns an unsubscribe function.
         * A loaded window is a window, which was added to a workspace and it's contents were loaded.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event. Receives the loaded window as a parameter.
         */
        onWindowLoaded(callback: (window: WorkspaceWindow) => void): Promise<Unsubscribe>;

        /**
         * Notifies when a window inside a workspace part of this frame received focus and returns an unsubscribe function.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event. Receives the focused window as a parameter.
         */
        onWindowFocusChange(callback: (window: WorkspaceWindow) => void): Promise<Unsubscribe>;

        /**
         * Notifies when a new parent was added to a workspace part of this frame and returns an unsubscribe function.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event. Receives the added parent as a parameter.
         */
        onParentAdded(callback: (parent: WorkspaceParent) => void): Promise<Unsubscribe>;

        /**
         * Notifies when a parent was removed from a workspace part of this frame and returns an unsubscribe function.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event. Receives an object containing the ids of the removed parent and the respective workspace and frame as a parameter.
         */
        onParentRemoved(callback: (removed: { id: string; workspaceId: string; frameId: string }) => void): Promise<Unsubscribe>;

        /**
         * Notifies when the contents of a parent inside a workspace part of this frame has changed and returns an unsubscribe function.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event. Receives the updated parent as a parameter.
         */
        onParentUpdated(callback: (parent: Row | Column | Group) => void): Promise<Unsubscribe>;
    }

    /** An object describing a workspace */
    export interface Workspace extends WorkspaceSummary {

        /** A collection containing the immediate children of this workspace */
        children: WorkspaceElement[];

        /** An object representing the frame containing this workspace */
        frame: Frame;

        /**
         * Gives focus to this workspace.
         */
        focus(): Promise<void>;

        /**
         * Closes this workspace and all of it's children.
         */
        close(): Promise<void>;

        /**
         * Returns a snapshot object describing the full current state of this workspace.
         */
        snapshot(): Promise<WorkspaceSnapshot>;

        /**
         * Sets a new title for this workspace.
         * @param title The new title value.
         */
        setTitle(title: string): Promise<void>;

        /**
         * Updates this workspace reference to reflect the current state of the workspace. 
         */
        refreshReference(): Promise<void>;

        /**
         * Saves the current workspace structure as a layout. In Glue42 Core this will throw an error if the name matches the name of a read-only layout.
         * @param name A string representing the name (also ID) of the new workspace layout.
         */
        saveLayout(name: string): Promise<void>;

        /**
         * Returns the first parent in this workspace, which satisfies the provided predicate.
         * @param predicate A filtering function (predicate) called for each parent present in this workspace.
         */
        getParent(predicate: (parent: WorkspaceParent) => boolean): WorkspaceParent;

        /**
         * Returns all parents in this workspace, which satisfy the provided predicate. If no predicate was provided, will return all parents.
         * @param predicate A filtering function (predicate) called for each parent present in this workspace.
         */
        getAllParents(predicate?: (parent: WorkspaceParent) => boolean): WorkspaceParent[];

        /**
         * Returns the first row in this workspace, which satisfies the provided predicate.
         * @param predicate A filtering function (predicate) called for each row present in this workspace.
         */
        getRow(predicate: (row: Row) => boolean): Row;

        /**
         * Returns all rows in this workspace, which satisfy the provided predicate. If no predicate was provided, will return all rows.
         * @param predicate A filtering function (predicate) called for each row present in this workspace.
         */
        getAllRows(predicate?: (row: Row) => boolean): Row[];

        /**
         * Returns the first column in this workspace, which satisfies the provided predicate.
         * @param predicate A filtering function (predicate) called for each column present in this workspace.
         */
        getColumn(predicate: (column: Column) => boolean): Column;

        /**
         * Returns all columns in this workspace, which satisfy the provided predicate. If no predicate was provided, will return all column.
         * @param predicate A filtering function (predicate) called for each column present in this workspace.
         */
        getAllColumns(predicate?: (columns: Column) => boolean): Column[];

        /**
         * Returns the first group in this workspace, which satisfies the provided predicate.
         * @param predicate A filtering function (predicate) called for each group present in this workspace.
         */
        getGroup(predicate: (group: Group) => boolean): Group;

        /**
         * Returns all groups in this workspace, which satisfy the provided predicate. If no predicate was provided, will return all groups.
         * @param predicate A filtering function (predicate) called for each group present in this workspace.
         */
        getAllGroups(predicate?: (group: Group) => boolean): Group[];

        /**
         * Returns the first window in this workspace, which satisfies the provided predicate.
         * @param predicate A filtering function (predicate) called for each window present in this workspace.
         */
        getWindow(predicate: (window: WorkspaceWindow) => boolean): WorkspaceWindow;

        /**
         * Returns all windows in this workspace, which satisfy the provided predicate. If no predicate was provided, will return all windows.
         * @param predicate A filtering function (predicate) called for each window present in this workspace.
         */
        getAllWindows(predicate?: (window: WorkspaceWindow) => boolean): WorkspaceWindow[];

        /**
         * Adds a new row to this workspace.
         * @param definition An object describing the available row settings.
         */
        addRow(definition?: ParentDefinition): Promise<Row>;

        /**
         * Adds a new column to this workspace.
         * @param definition An object describing the available column settings.
         */
        addColumn(definition?: ParentDefinition): Promise<Column>;

        /**
         * Adds a new group to this workspace.
         * @param definition An object describing the available group settings.
         */
        addGroup(definition?: ParentDefinition): Promise<Group>;

        /**
         * Adds a new window to this workspace.
         * @param definition An object describing the available window settings.
         */
        addWindow(definition: WorkspaceWindowDefinition): Promise<WorkspaceWindow>;

        /**
         * Removes the first element of this workspace which satisfies the predicate.
         * @param predicate A filtering function (predicate) called for each element in this workspace.
         */
        remove(predicate: (child: WorkspaceElement) => boolean): Promise<void>;

        /**
         * Removes the first immediate child of this parent which satisfies the predicate.
         * @param predicate A filtering function (predicate) called for immediate child of this parent.
         */
        removeChild(predicate: (child: WorkspaceElement) => boolean): Promise<void>;

        /**
         * Transforms this workspace into a workspace with one immediate child of type row and all existing elements are inserted as a child to that row.
         */
        bundleToRow(): Promise<void>;

        /**
         * Transforms this workspace into a workspace with one immediate child of type column and all existing elements are inserted as a child to that row.
         */
        bundleToColumn(): Promise<void>;

        /**
         * Notifies when this workspace is about to close.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event.
         */
        onClosing(callback: () => void): Promise<Unsubscribe>;

        /**
         * Notifies when this workspace is closed.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event.
         */
        onClosed(callback: () => void): Promise<Unsubscribe>;

        /**
         * Notifies when this workspace either gained or lost focus.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event.
         */
        onFocusChange(callback: () => void): Promise<Unsubscribe>;

        /**
         * Notifies when a new window was added to this workspace and returns an unsubscribe function.
         * An added window means that the window has a place in the workspace (it is a valid workspace element), but does not guarantee that the contents of the window are loaded.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event. Receives the added window as a parameter.
         */
        onWindowAdded(callback: (window: WorkspaceWindow) => void): Promise<Unsubscribe>;

        /**
         * Notifies when a window was removed from this workspace and returns an unsubscribe function.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event. Receives an object containing the ids of the removed window, and the respective workspace and frame as a parameter.
         */
        onWindowRemoved(callback: (removed: { windowId?: string; workspaceId: string; frameId: string }) => void): Promise<Unsubscribe>;

        /**
         * Notifies when a window's content was loaded in this workspace and returns an unsubscribe function.
         * A loaded window is a window, which was added to a workspace and it's contents were loaded.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event. Receives the loaded window as a parameter.
         */
        onWindowLoaded(callback: (window: WorkspaceWindow) => void): Promise<Unsubscribe>;

        /**
         * Notifies when a window inside this workspace received focus and returns an unsubscribe function.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event. Receives the focused window as a parameter.
         */
        onWindowFocusChange(callback: (window: WorkspaceWindow) => void): Promise<Unsubscribe>;

        /**
         * Notifies when a new parent was added to this workspace and returns an unsubscribe function.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event. Receives the added parent as a parameter.
         */
        onParentAdded(callback: (parent: WorkspaceParent) => void): Promise<Unsubscribe>;

        /**
         * Notifies when a parent was removed from this workspace and returns an unsubscribe function.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event. Receives an object containing the ids of the removed parent and the respective workspace and frame as a parameter.
         */
        onParentRemoved(callback: (removed: { id: string; workspaceId: string; frameId: string }) => void): Promise<Unsubscribe>;

        /**
         * Notifies when the contents of a parent part of this workspace has changed and returns an unsubscribe function.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event. Receives the updated parent as a parameter.
         */
        onParentUpdated(callback: (parent: Row | Column | Group) => void): Promise<Unsubscribe>;
    }

    /** An object containing the summary of a workspace parent */
    export interface ParentSummary {

        /** An unique string identifier of this parent */
        id: string;

        /** The unique string identifier of the frame containing this parent */
        frameId: string;

        /** The unique string identifier of the workspace containing this parent */
        workspaceId: string;

        /** An number representing the positing of this parent relative to it's siblings */
        positionIndex: number;
    }

    /** An object describing a workspace parent */
    export interface Parent extends ParentSummary {

        /** A collection containing the immediate children of this parent */
        children: WorkspaceElement[];

        /** An object representing this parent's parent */
        parent: Workspace | WorkspaceParent;

        /** An object representing the frame containing this parent */
        frame: Frame;

        /** An object representing the workspace containing this parent */
        workspace: Workspace;

        /**
         * Opens a new window inside this parent and loads it's content.
         * @param definition An object describing the requested window.
         */
        addWindow(definition: WorkspaceWindowDefinition): Promise<WorkspaceWindow>;

        /**
         * Adds a new group parent to this parent.
         * @param definition An object describing the type of the requested builder, alongside other settings.
         */
        addGroup(definition?: ParentDefinition | ParentBuilder): Promise<Group>;

        /**
         * Adds a new column parent to this parent.
         * @param definition An object describing the type of the requested builder, alongside other settings.
         */
        addColumn(definition?: ParentDefinition | ParentBuilder): Promise<Column>;

        /**
         * Adds a new row parent to this parent.
         * @param definition An object describing the type of the requested builder, alongside other settings.
         */
        addRow(definition?: ParentDefinition | ParentBuilder): Promise<Row>;

        /**
         * Removes the first immediate child of this parent which satisfies the predicate.
         * @param predicate A filtering function (predicate) called for immediate child of this parent.
         */
        removeChild(predicate: (child: WorkspaceElement) => boolean): Promise<void>;

        /**
         * Maximizes this parent relative to it's parent.
         */
        maximize(): Promise<void>;

        /**
         * Restores this parent, if previously maximized.
         */
        restore(): Promise<void>;

        /**
         * Closes this parent all of it's children.
         */
        close(): Promise<void>;
    }

    /** An object describing a row type workspace parent */
    export interface Row extends Parent {
        type: "row";
    }

    /** An object describing a column type workspace parent */
    export interface Column extends Parent {
        type: "column";
    }

    /** An object describing a group type workspace parent */
    export interface Group extends Parent {
        type: "group";
    }

    /** An object describing a window part of an existing workspace */
    export interface WorkspaceWindow extends WorkspaceWindowSummary {

        /** An object representing the workspace, which contains this window */
        workspace: Workspace;

        /** An object representing the frame, which contains this window */
        frame: Frame;

        /** An object representing the parent, which contains this window */
        parent: Workspace | WorkspaceParent;

        /**
         * Forces a window, which was added to the workspace to load it's contents.
         */
        forceLoad(): Promise<void>;

        /**
         * Gives focus to the window.
         */
        focus(): Promise<void>;

        /**
         * Closes the workspace window.
         */
        close(): Promise<void>;

        /**
         * Sets a new title to the workspace window.
         * @param title The new title for the window.
         */
        setTitle(title: string): Promise<void>;

        /**
         * Maximizes the workspace window relative to it's parent.
         */
        maximize(): Promise<void>;

        /**
         * Restores a previously maximized workspace window.
         */
        restore(): Promise<void>;

        /**
         * Removes a workspace window from the workspace and turns it into a standalone window.
         */
        eject(): Promise<any>;

        /**
         * Returns the underlying GDWindow (Enterprise) or WebWindow (Core) of the workspace window.
         */
        getGdWindow(): any;

        /**
         * Moves the workspace window to a new parent. In Glue42 Core this parent must be part of the same frame.
         * @param parent An object describing the new parent of the window.
         */
        moveTo(parent: WorkspaceParent): Promise<void>;

        /**
         * Notifies when this window was added to any workspace in any frame and returns an unsubscribe function.
         * An added window means that the window has a place in a workspace (it is a valid workspace element), but does not guarantee that the contents of the window are loaded.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event.
         */
        onAdded(callback: () => void): Promise<Unsubscribe>;

        /**
         * Notifies when this window's content loaded and returns an unsubscribe function.
         * A loaded window is a window, which was added to a workspace and it's contents were loaded.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event.
         */
        onLoaded(callback: () => void): Promise<Unsubscribe>;

        /**
         * Notifies when the parent of this window has changed.
         * @param callback Callback function to handle the event. Receives the new parent object as a parameter.
         */
        onParentChanged(callback: (newParent: WorkspaceParent | Workspace) => void): Promise<Unsubscribe>;

        /**
         * Notifies when this window was removed from the workspace.
         * @param callback Callback function to handle the event.
         */
        onRemoved(callback: () => void): Promise<Unsubscribe>;
    }

    /** An object describing a builder user to create workspaces */
    export interface WorkspaceBuilder {
        /**
         * Adds a new row parent to the calling parent. Returns the new row parent.
         * @param config An object describing the type of the requested builder, alongside other settings.
         */
        addRow(definition?: ParentDefinition): ParentBuilder;

        /**
         * Adds a new column parent to the calling parent. Returns the new column parent.
         * @param config An object describing the type of the requested builder, alongside other settings.
         */
        addColumn(definition?: ParentDefinition): ParentBuilder;

        /**
         * Adds a new group parent to the calling parent. Returns the new group parent.
         * @param config An object describing the type of the requested builder, alongside other settings.
         */
        addGroup(definition?: ParentDefinition): ParentBuilder;

        /**
         * Adds a new window to the calling parent. Returns the immediate parent of the window.
         * @param config An object describing the requested window.
         */
        addWindow(definition: WorkspaceWindowDefinition): WorkspaceBuilder;

        /**
         * Creates a new workspace using the builder as a blueprint for structure and contents.
         * @param config An object containing workspace creating options.
         */
        create(config?: WorkspaceCreateConfig): Promise<Workspace>;
    }

    /** An object describing a builder user to create workspace parents */
    export interface ParentBuilder {
        /**
         * Adds a new row parent to the calling parent. Returns the new row parent.
         * @param config An object describing the type of the requested builder, alongside other settings.
         */
        addRow(definition?: ParentDefinition): ParentBuilder;

        /**
         * Adds a new column parent to the calling parent. Returns the new column parent.
         * @param config An object describing the type of the requested builder, alongside other settings.
         */
        addColumn(definition?: ParentDefinition): ParentBuilder;

        /**
         * Adds a new group parent to the calling parent. Returns the new group parent.
         * @param config An object describing the type of the requested builder, alongside other settings.
         */
        addGroup(definition?: ParentDefinition): ParentBuilder;

        /**
         * Adds a new window to the calling parent. Returns the immediate parent of the window.
         * @param config An object describing the requested window.
         */
        addWindow(definition: WorkspaceWindowDefinition): ParentBuilder;

        /**
         * Returns the JSON object which describes the full structure of the parent.
         */
        serialize(): ParentDefinition;
    }

    /** A configuration object used to save a current workspace as a layout */
    export interface WorkspaceLayoutSaveConfig {
        /**
         * A string used as name (doubles as id) of the layout, which is later used when restoring it. 
         */
        name: string;

        /**
         * A string representing the id of the workspace whose structure should be saved into a layout.
         */
        workspaceId: string;
    }

    /** An object describing the complete state of a frame at the time when the object was created */
    export interface FrameSnapshot {
        /**
         * A string identifier unique to each frame
         */
        id: string;
    }

    /** An object describing the complete state of a workspace at the time when the object was created */
    export interface WorkspaceSnapshot {
        /**
         * A string identifier unique to each workspace
         */
        id: string;
    }

    /** An API enabling basic CRUD workspaces actions */
    export interface WorkspaceLayoutsAPI {
        /**
         * Returns a collection of summarized layouts data. This data contains all the standard data excluding the actual structure of the layout.
         * This is helpful in cases where a simple query of existing layouts is needed without the complexity of transmitting the full layouts structure.
         */
        getSummaries(): Promise<WorkspaceLayoutSummary[]>;

        /**
         * Deletes a previously saved layout. In Glue42 Core delete will fail with an error in trying to delete a read-only layout, this is a layout defined in the glue.layouts.json file.
         * @param name The name of the layout to delete.
         */
        delete(name: string): Promise<void>;

        /**
         * Returns all layouts which satisfy the predicate. This collection of all saved layouts includes the layouts structure. If no predicate is provided, it returns all saved layouts.
         * @param predicate A filtering function (predicate) called for each saved layout.
         */
        export(predicate?: (layout: WorkspaceLayout) => boolean): Promise<WorkspaceLayout[]>;

        /**
         * Saves the provided layouts into Glue42. In Glue42 Core this will fail with an error if a provided layout's name matches a read-only layout.
         * @param layouts A collection of layouts to add to Glue42.
         */
        import(layouts: WorkspaceLayout[]): Promise<void>;

        /**
         * Saves an existing, open workspace as a layout.
         * @param config An object describing the name of the layout and the id of the workspace, whose structure will be saved.
         */
        save(config: WorkspaceLayoutSaveConfig): Promise<WorkspaceLayout>;
    }

    /**
     * @docmenuorder 1
     */
    export interface API {
        /**
         * Checks whether or not the calling window is currently present inside of a workspace
         */
        inWorkspace(): Promise<boolean>;

        /**
         * Gets either a workspace or a parent builder depending on the provided type inside the config object.
         * This builder is used to dynamically construct a workspace runtime.
         * @param config An object describing the type of the requested builder, alongside other settings.
         */
        getBuilder(config: BuilderConfig): WorkspaceBuilder | ParentBuilder;

        /**
         * Returns the frame instance of the calling window. Throws an error if the calling window is not part of a workspace.
         */
        getMyFrame(): Promise<Frame>;

        /**
         * Returns the first frame instance which satisfies the provided predicate or undefined, if non do.
         * @param predicate A filtering function (predicate) called for each open frame.
         */
        getFrame(predicate: (frame: Frame) => boolean): Promise<Frame>;

        /**
         * Returns all frames which satisfy the provided predicate. If no predicate is provided, will return all frames.
         * @param predicate A filtering function (predicate) called for each open frame.
         */
        getAllFrames(predicate?: (frame: Frame) => boolean): Promise<Frame[]>;

        /**
         * Returns an collection of objects, where each object contains basic information about an open workspace.
         * This function was designed for easy and quick listing of existing workspaces without adding the complexity of transmitting the entire structure of each workspace.
         */
        getAllWorkspacesSummaries(): Promise<WorkspaceSummary[]>;

        /**
         * Returns the instance of the workspace where the calling window is located.
         * Throws an error if the calling window is not not part of any workspace.
         */
        getMyWorkspace(): Promise<Workspace>;

        /**
         * Returns the first workspace instance which satisfies the provided predicate or undefined, if non do.
         * @param predicate A filtering function (predicate) called for each open workspace.
         */
        getWorkspace(predicate: (workspace: Workspace) => boolean): Promise<Workspace>;

        /**
         * Returns all workspaces which satisfy the provided predicate. If no predicate is provided, will return all workspaces.
         * @param predicate A filtering function (predicate) called for each open workspace.
         */
        getAllWorkspaces(predicate?: (workspace: Workspace) => boolean): Promise<Workspace[]>;

        /**
         * Returns the workspace window instance of the first window, which is part of a workspace and satisfies the provided predicate.
         * This function will search recursively in all open workspaces.
         * @param predicate A filtering function (predicate) called for each window in each open workspace.
         */
        getWindow(predicate: (workspaceWindow: WorkspaceWindow) => boolean): Promise<WorkspaceWindow>;

        /**
         * Returns the instance of the first parent, which satisfies the provided predicate.
         * This function will search recursively in all open workspaces.
         * @param predicate A filtering function (predicate) called for each parent in each open workspace.
         */
        getParent(predicate: (parent: WorkspaceParent) => boolean): Promise<WorkspaceParent>;

        /**
         * Opens a new workspace by restoring a previously saved workspace layout.
         * @param name The name of a saved workspace layout, which will be restored.
         * @param options An optional object containing various workspace restore options.
         */
        restoreWorkspace(name: string, options?: RestoreWorkspaceConfig): Promise<Workspace>;

        /**
         * Opens a new workspace based on the provided definition.
         * @param definition An object describing the shape and options of the workspace.
         * @param saveConfig An object used to set various create options.
         */
        createWorkspace(definition: WorkspaceDefinition, saveConfig?: WorkspaceCreateConfig): Promise<Workspace>;

        /**
         * An API which gives full read, write and delete access to the workspaces layouts.
         */
        layouts: WorkspaceLayoutsAPI;

        /**
         * Notifies when a new frame was opened and returns an unsubscribe function.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event. Receives the added frame as a parameter.
         */
        onFrameOpened(callback: (frame: Frame) => void): Promise<Unsubscribe>;

        /**
         * Notifies when a frame is about to be closed and returns an unsubscribe function.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event. Receives the frame as a parameter.
         */
        onFrameClosing(callback: (frame: Frame) => void): Promise<Unsubscribe>;

        /**
         * Notifies when a new frame was closed and returns an unsubscribe function.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event. Receives an object containing the id of the closed frame as a parameter.
         */
        onFrameClosed(callback: (closed: { frameId: string }) => void): Promise<Unsubscribe>;

        /**
         * Notifies when a change in the frame focus has happened and returns an unsubscribe function.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event. Receives the frame which now has focus as a parameter.
         */
        onFrameFocusChange(callback: (frame: Frame) => void): Promise<Unsubscribe>;

        /**
         * Notifies when a new workspace was opened in any of the opened frames and returns an unsubscribe function.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event. Receives the added workspace as a parameter.
         */
        onWorkspaceOpened(callback: (workspace: Workspace) => void): Promise<Unsubscribe>;

        /**
         * Notifies when a workspace present in any of the opened frames is about to be closed and returns an unsubscribe function.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event. Receives the workspace as a parameter.
         */
        onWorkspaceClosing(callback: (workspace: Workspace) => void): Promise<Unsubscribe>;

        /**
         * Notifies when a workspace present in any of the opened frames was closed and returns an unsubscribe function.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event. Receives an object with the closed workspace id and frame id as a parameter.
         */
        onWorkspaceClosed(callback: (closed: { frameId: string; workspaceId: string }) => void): Promise<Unsubscribe>;

        /**
         * Notifies when a change in the workspace focus has happened and returns an unsubscribe function.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event. Receives the workspace which now has focus as a parameter.
         */
        onWorkspaceFocusChange(callback: (workspace: Workspace) => void): Promise<Unsubscribe>;

        /**
         * Notifies when a new window was added to any workspace in any frame and returns an unsubscribe function.
         * An added window means that the window has a place in a workspace (it is a valid workspace element), but does not guarantee that the contents of the window are loaded.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event. Receives the added window as a parameter.
         */
        onWindowAdded(callback: (workspaceWindow: WorkspaceWindow) => void): Promise<Unsubscribe>;

        /**
         * Notifies when a window's content was loaded in any workspace in any frame and returns an unsubscribe function.
         * A loaded window is a window, which was added to a workspace and it's contents were loaded.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event. Receives the loaded window as a parameter.
         */
        onWindowLoaded(callback: (workspaceWindow: WorkspaceWindow) => void): Promise<Unsubscribe>;

        /**
         * Notifies when a window was removed from any workspace and any frame and returns an unsubscribe function.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event. Receives an object containing the ids of the removed window, and the respective workspace and frame as a parameter.
         */
        onWindowRemoved(callback: (removed: { windowId?: string; workspaceId: string; frameId: string }) => void): Promise<Unsubscribe>;

        /**
         * Notifies when a window received focus and returns an unsubscribe function.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event. Receives the focused window as a parameter.
         */
        onWindowFocusChange(callback: (workspaceWindow: WorkspaceWindow) => void): Promise<Unsubscribe>;

        /**
         * Notifies when a new parent was added to any workspace in any of the opened frames and returns an unsubscribe function.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event. Receives the added parent as a parameter.
         */
        onParentAdded(callback: (parent: WorkspaceParent) => void): Promise<Unsubscribe>;

        /**
         * Notifies when a parent was removed from any workspace in any of the opened frames and returns an unsubscribe function.
         * Not supported in Glue42 Core
         * @param callback Callback function to handle the event. Receives an object containing the ids of the removed parent and the respective workspace and frame as a parameter.
         */
        onParentRemoved(callback: (removed: { id: string; workspaceId: string; frameId: string }) => void): Promise<Unsubscribe>;
    }
}