import notifee from '@notifee/react-native';

type IMessage = {
    title: string,
    body: string,
    messageId: number | string,
    dataType: string
}

export async function displayLocalNotification(message: IMessage) {
    const channelId = await notifee.createChannel({
        id: String(message.messageId),
        name: 'Default Channel'
    })
    await notifee.displayNotification({
        title: message.title,
        body: message.body,
        android: {
            channelId,
            // smallIcon: 'ic_stat_name',
            localOnly: true,
            pressAction: {
                id: String(message.messageId),
                launchActivity: 'default'
            },
        },
        data: {
            type: message.dataType
        }
    })

}