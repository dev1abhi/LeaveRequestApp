const webpush = require('web-push');

// Set your VAPID details (optional, you can omit these if you prefer)
const vapidKeys = webpush.generateVAPIDKeys();

console.log('Public Key:', vapidKeys.publicKey);
console.log('Private Key:', vapidKeys.privateKey);