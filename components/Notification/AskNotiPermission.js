import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';



//Yêu cầu quyền (permission) gửi thông báo đẩy (push notification) trên thiết bị
//Lấy và trả về Expo Push Token nếu người dùng cấp quyền

const AskingNotificationPermissonToken = async () => {
  let token;
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS,
  );
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return (token = '');
  }
  token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
};

export default AskingNotificationPermissonToken;