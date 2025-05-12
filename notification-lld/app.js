class Notification {
    constructor(recipient, content) {
        this.recipient = recipient;
        this.content = content;
    }
}

// Abstract Notifier class defining the interface
class Notifier {
    send(notification) {
        // Subclasses should override this method
        throw new Error('Notifier.send() must be implemented by subclasses');
    }
}

// Email Notifier implementation
class EmailNotifier extends Notifier {
    constructor() {
        super();
        // In a real scenario, you might initialize email server config here
    }

    send(notification) {
        // Simulate sending an email (in reality, use an email library or API)
        const { recipient, content } = notification;
        console.log(`📧 Sending EMAIL to ${recipient}: "${content}"`);
        // Here we would have logic like using Nodemailer or an SMTP client.
        // e.g., emailClient.sendMail({ to: recipient, body: content, ... });
        return { status: 'success', channel: 'email' };
    }
}

// SMS Notifier implementation
class SMSNotifier extends Notifier {
    constructor() {
        super();
        // Could set up SMS gateway credentials here
    }

    send(notification) {
        const { recipient, content } = notification;
        console.log(`📩 Sending SMS to ${recipient}: "${content}"`);
        // In reality, call SMS API (e.g., Twilio messages.create(...)).
        return { status: 'success', channel: 'sms' };
    }
}

// Push Notifier implementation
class PushNotifier extends Notifier {
    constructor() {
        super();
        // Could set up push service credentials (Firebase, APNs, etc.)
    }

    send(notification) {
        const { recipient, content } = notification;
        console.log(`📲 Sending PUSH notification to device ${recipient}: "${content}"`);
        // In reality, call push service API (e.g., FCM send to a device token).
        return { status: 'success', channel: 'push' };
    }
}

class NotificationService {
    constructor() {
        // Initialize the available notifiers. This could also be passed in (dependency injection).
        this.notifiers = {
            email: new EmailNotifier(),
            sms: new SMSNotifier(),
            push: new PushNotifier(),
        };
    }

    sendNotification(notification, channelType) {
        // Find the appropriate notifier based on channelType
        const notifier = this.notifiers[channelType];
        if (!notifier) {
            throw new Error(`Unsupported notification channel: ${channelType}`);
        }

        // Delegate sending to the notifier
        console.log(`NotificationService: Dispatching to ${channelType} notifier...`);
        const result = notifier.send(notification);
        console.log(`NotificationService: ${channelType} send result ->`, result);
        return result;
    }
}

// Example usage:
const service = new NotificationService();

// Create a notification instance (recipient could be an email address for email, phone number for SMS, device token for push)
const welcomeEmail = new Notification('user@example.com', 'Welcome to our platform!');
service.sendNotification(welcomeEmail, 'email');

const otpSms = new Notification('+15551234567', 'Your OTP code is 123456');
service.sendNotification(otpSms, 'sms');

const promoPush = new Notification('DEVICE_TOKEN_ABC123', 'You have a new reward waiting!');
service.sendNotification(promoPush, 'push');
