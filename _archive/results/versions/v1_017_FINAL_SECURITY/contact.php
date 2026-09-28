<?php
/**
 * contact.php - v1.017 Professional Contact System
 * Handles server-side mailing with bot security specifically for acttechnical.com
 */

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. "Silent" Honeypot check
    // If the hidden 'website' field is populated, we treat it as success in response
    // but do NOT perform any action (dropping the bot spam).
    if (!empty($_POST['website'])) {
        echo json_encode(["status" => "success", "message" => "Technical Inquiry Transmitted Successfully."]);
        exit;
    }

    // 2. Extract and Sanitize Inputs
    $name = isset($_POST["name"]) ? strip_tags(trim($_POST["name"])) : "";
    $email = isset($_POST["email"]) ? filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL) : "";
    $phone = isset($_POST["phone"]) ? strip_tags(trim($_POST["phone"])) : "";
    $brief = isset($_POST["brief"]) ? strip_tags(trim($_POST["brief"])) : "";

    // 3. Validation
    if (empty($name) || empty($brief) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Technical validation failed. Please check your inputs."]);
        exit;
    }

    // 4. Recipient Logic
    $recipient = "info@acttechnical.com";

    // 5. Build Email Content
    $subject = "ACT Technical Inquiry: $name";
    $email_content = "--------------------------------------------------\n";
    $email_content .= "ACT TECHNICAL SYSTEM INQUIRY [v1.017]\n";
    $email_content .= "--------------------------------------------------\n\n";
    $email_content .= "Client Name: $name\n";
    $email_content .= "Client Email: $email\n";
    $email_content .= "Client Phone: $phone\n\n";
    $email_content .= "PROJECT BRIEF:\n";
    $email_content .= "$brief\n\n";
    $email_content .= "--------------------------------------------------\n";
    $email_content .= "End of Transmission\n";

    // 6. Headers
    $headers = "From: inquiry@acttechnical.com\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // 7. Transmit
    if (mail($recipient, $subject, $email_content, $headers)) {
        echo json_encode(["status" => "success", "message" => "Technical Inquiry Transmitted Successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Mailing Engine Failure. Please contact support via phone."]);
    }
} else {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Prohibited access method."]);
}
?>
