-- CreateTable
CREATE TABLE "InvoicePayment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount_paid" REAL,
    "display_amount_paid" TEXT,
    "underpaid_amount" REAL,
    "overpaid_amount" REAL,
    "non_pay_pro_payment_received" TEXT,
    "transaction_currency" TEXT,
    "universal_codes_payment_string" TEXT,
    "universal_codes_verification_link" TEXT
);

-- CreateTable
CREATE TABLE "InvoiceBuyerProvidedInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "phone_number" TEXT,
    "selected_wallet" TEXT,
    "email_address" TEXT,
    "selected_transaction_currency" TEXT,
    "sms" TEXT,
    "sms_verified" TEXT
);

-- CreateTable
CREATE TABLE "InvoiceBuyer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "address1" TEXT,
    "address2" TEXT,
    "city" TEXT,
    "region" TEXT,
    "postal_code" TEXT,
    "country" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "notify" TEXT,
    "buyer_provided_email" TEXT,
    "invoice_buyer_provided_info_id" INTEGER,
    CONSTRAINT "InvoiceBuyer_invoice_buyer_provided_info_id_fkey" FOREIGN KEY ("invoice_buyer_provided_info_id") REFERENCES "InvoiceBuyerProvidedInfo" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pos_data_json" TEXT,
    "price" REAL,
    "status" TEXT,
    "currency_code" TEXT,
    "token" TEXT,
    "bitpay_id" TEXT,
    "bitpay_order_id" TEXT,
    "bitpay_guid" TEXT,
    "bitpay_url" TEXT,
    "merchant_name" TEXT,
    "created_date" DATETIME,
    "expiration_time" DATETIME,
    "transaction_speed" TEXT,
    "json_pay_pro_required" BOOLEAN,
    "item_description" TEXT,
    "low_fee_detected" BOOLEAN,
    "invoice_payment_id" INTEGER,
    CONSTRAINT "Invoice_invoice_payment_id_fkey" FOREIGN KEY ("invoice_payment_id") REFERENCES "InvoicePayment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceBuyer_invoice_buyer_provided_info_id_key" ON "InvoiceBuyer"("invoice_buyer_provided_info_id");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoice_payment_id_key" ON "Invoice"("invoice_payment_id");
