describe('get()', () => {
    before(() => {
        return Promise.all([glueReady, gtfReady]);
    });

    afterEach(async () => {
        const channelNames = await glue.channels.all();
        const resetChannelPromises = channelNames.map((channelName) => glue.contexts.set(`___channel___${channelName}`, {
            name: channelName,
            meta: {
                color: channelName.toLowerCase()
            },
            data: {}
        }));

        return Promise.all([...resetChannelPromises, glue.channels.leave()]);
    });

    it('Should reject with an error when name isn\'t of type string.', async () => {
        try {
            await glue.channels.get(1);
            throw new Error('get() should have thrown an error because name wasn\'t of type string!');
        } catch (error) {
            expect(error.message).to.equal('Please provide the channel name as a string!');
        }
    });

    it('Should reject with an error when there isn\'t a channel with the provided name.', async () => {
        const nonExistentChannelName = 'non-existent-channel-name';

        try {
            await glue.channels.get(nonExistentChannelName);
            throw new Error('get() should have thrown an error because there wasn\'t a channel with the provided name!');
        } catch (error) {
            expect(error.message).to.equal(`A channel with name: ${nonExistentChannelName} doesn't exist!`);
        }
    });

    it('Should return the context (name, meta and data) of the provided channel.', async () => {
        const [channel] = (await gtf.getGlueConfigJson()).channels;
        const channelName = channel.name;

        // Join the channel.
        await glue.channels.join(channelName);

        // The data to be published.
        const data = {
            test: 42
        };
        // Publish the data.
        await glue.channels.publish(data);

        // The expected new context.
        const context = {
            ...channel,
            data
        };

        // The channel context.
        const channelContext = await glue.channels.get(channelName);

        expect(channelContext).to.eql(context);
    });
});
