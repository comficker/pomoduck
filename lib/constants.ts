export enum TASK_STATUS {
  DRAFT, ACTIVE, COMPLETED, DELETED, DOING
}

export const BASE_MINING_SPEED = 8.33333333e-5

export enum ACCOUNT_STATUS {
  BURNED, ACTIVE, FOR_RENT, FOR_SALE, EQUIPPED
}

const SAMPLE_PAYLOAD = {
  "transaction_id": "0x40186b404bc9ce79354a4aeb292696c254388ad5f89c009fa853197c8f170f5c",
  "reference": "1087",
  "timestamp": "2025-11-26T10:46:15.959+07:00",
  "from": "0x1458ff6b0b7ebe1ece67250608495d56002d3393",
  "chain": "worldchain",
  "transaction_status": "submitted",
  "status": "success"
}
