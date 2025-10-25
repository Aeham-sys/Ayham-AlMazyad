<?php
// بياناتك السرية (حافظ عليها ولا تشاركها مع أحد)
$bot_token = '7091182347:AAFRHvhq6z-QnYqq4KZvo77BZ7e3r1e4jUU';  // مثلاً: 123456789:ABCdEfGhIJKLmNoPqRsTuvWxYZ
$chat_id = '1047583589';      // آخذ الـ chat_id من البوت الخاص فيك

// استقبال البيانات من الـ JavaScript
$data = json_decode(file_get_contents("php://input"), true);

// جهز الرسالة
$message = "📬 رسالة جديدة من الموقع:\n\n";
$message .= "👤 الاسم: " . $data['firstName'] . " " . $data['lastName'] . "\n";
$message .= "📧 الإيميل: " . $data['email'] . "\n";
$message .= "📝 الموضوع: " . $data['subject'] . "\n";
$message .= "💬 الرسالة: " . $data['message'];

// إرسال الطلب
$url = "https://api.telegram.org/bot7091182347:AAFRHvhq6z-QnYqq4KZvo77BZ7e3r1e4jUU/sendMessage";
$params = [
  'chat_id' => 1047583589,
  'text' => $message
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($ch);
curl_close($ch);

echo "✔️ تم إرسال الرسالة بنجاح!";
?>
