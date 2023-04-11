-- CreateTable
CREATE TABLE "InvoicePayment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount_paid" REAL,
    "display_amount_paid" TEXT,
    "underpaid_amount" REAL,
    "overpaid_amount" REAL,
    "non_pay_pro_payment_received" BOOLEAN,
    "transaction_currency" TEXT,
    "universal_codes_payment_string" TEXT,
    "universal_codes_verification_link" TEXT
);

-- CreateTable
CREATE TABLE "InvoicePaymentCurrency" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "invoice_payment_id" INTEGER,
    "currency_code" TEXT,
    "total" REAL,
    "subtotal" REAL,
    "display_total" TEXT,
    "display_subtotal" TEXT,
    "invoice_pyament_currency_miner_fee_id" INTEGER,
    "invoice_payment_currency_supported_transaction_currency_id" INTEGER,
    CONSTRAINT "InvoicePaymentCurrency_invoice_payment_id_fkey" FOREIGN KEY ("invoice_payment_id") REFERENCES "InvoicePayment" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "InvoicePaymentCurrency_invoice_pyament_currency_miner_fee_id_fkey" FOREIGN KEY ("invoice_pyament_currency_miner_fee_id") REFERENCES "InvoicePyamentCurrencyMinerFee" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "InvoicePaymentCurrency_invoice_payment_currency_supported_transaction_currency_id_fkey" FOREIGN KEY ("invoice_payment_currency_supported_transaction_currency_id") REFERENCES "InvoicePaymentCurrencySupportedTransactionCurrency" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InvoicePaymentCurrencyCode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT,
    "code_url" TEXT,
    "invoice_payment_currency_id" INTEGER,
    CONSTRAINT "InvoicePaymentCurrencyCode_invoice_payment_currency_id_fkey" FOREIGN KEY ("invoice_payment_currency_id") REFERENCES "InvoicePaymentCurrency" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InvoicePaymentCurrencyExchangeRate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "currency_code" TEXT NOT NULL,
    "rate" REAL,
    "invoice_payment_currency_id" INTEGER,
    CONSTRAINT "InvoicePaymentCurrencyExchangeRate_invoice_payment_currency_id_fkey" FOREIGN KEY ("invoice_payment_currency_id") REFERENCES "InvoicePaymentCurrency" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InvoicePyamentCurrencyMinerFee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "satoshis_per_byte" REAL,
    "total_fee" REAL,
    "fiat_amount" REAL
);

-- CreateTable
CREATE TABLE "InvoicePaymentCurrencySupportedTransactionCurrency" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "enabled" BOOLEAN,
    "reason" TEXT
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
    "notify" BOOLEAN,
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
    "invoice_buyer_id" INTEGER,
    CONSTRAINT "Invoice_invoice_payment_id_fkey" FOREIGN KEY ("invoice_payment_id") REFERENCES "InvoicePayment" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Invoice_invoice_buyer_id_fkey" FOREIGN KEY ("invoice_buyer_id") REFERENCES "InvoiceBuyer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "InvoicePaymentCurrency_invoice_pyament_currency_miner_fee_id_key" ON "InvoicePaymentCurrency"("invoice_pyament_currency_miner_fee_id");

-- CreateIndex
CREATE UNIQUE INDEX "InvoicePaymentCurrency_invoice_payment_currency_supported_transaction_currency_id_key" ON "InvoicePaymentCurrency"("invoice_payment_currency_supported_transaction_currency_id");

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceBuyer_invoice_buyer_provided_info_id_key" ON "InvoiceBuyer"("invoice_buyer_provided_info_id");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoice_payment_id_key" ON "Invoice"("invoice_payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoice_buyer_id_key" ON "Invoice"("invoice_buyer_id");
