import PushNotification from 'react-native-push-notification';
import database from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';

class PushNotificationHandler {
  configure() {
    // Register background handler
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
      this.handleNotification(remoteMessage.data);
    });

    // Register foreground notification handler
    messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground notification:', remoteMessage);
      this.handleNotification(remoteMessage.data);
    });

    PushNotification.configure({
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  }

  async fetchDarshanDetailsForToday() {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    try {
      const snapshot = await database()
        .ref(`Darshan/${formattedDate}`)
        .once('value');
      return snapshot.val();
    } catch (error) {
      console.error('Error fetching Darshan details from database: ', error);
      return null;
    }
  }

  async createChannel(channelId) {
    const darshanDetails = await this.fetchDarshanDetailsForToday();
    if (!darshanDetails) {
      console.log('No Darshan details found for today.');
      return;
    }

    console.log('Creating notification channel.');
    PushNotification.createChannel(
      {
        channelId: channelId,
        channelName: 'My Darshan Channel',
        importance: 4,
      },
      (created) => console.log(`Channel created: ${created}`)
    );

    // Schedule notifications for each Darshan
    Object.keys(darshanDetails).forEach((darshanKey, index) => {
      const details = darshanDetails[darshanKey];
      this.scheduleNotification(channelId, details, index);
    });
  }

  scheduleNotification(channelId, darshanDetails, notificationId) {
    if (!darshanDetails || !darshanDetails.openingTime) {
      console.log('No opening time found in Darshan details.');
      return;
    }

    const now = new Date();
    const [hour, minute] = darshanDetails.openingTime.split(':').map(Number);
    const openingTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute
    );

    if (openingTime > now) {
      const timeDiff = openingTime - now;
      PushNotification.localNotificationSchedule({
        id: `${notificationId}`,
        channelId,
        title: darshanDetails.name,
        message: 'Check out the image below',
        date: new Date(Date.now() + timeDiff),
        bigPictureUrl: darshanDetails.image,
      });
    }
  }

  async handleNotification(data) {
    if (data && data.name && data.image) {
      PushNotification.localNotification({
        channelId: 'default_channel_id',
        title: data.name,
        message: 'Check out the image below',
        bigPictureUrl: data.image,
      });
    }
  }
}

export default new PushNotificationHandler();
