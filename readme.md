# Serverless Notes API

A simple CRUD REST API built with **Node.js, AWS Lambda, API Gateway, S3, and IAM**.

This project is designed to understand how a basic **serverless backend** works on AWS.

---

## Architecture

```text
Client
   ↓
HTTP Request
   ↓
API Gateway
   ↓
Lambda
   ↓
S3
```

### How it works

* **API Gateway** receives HTTP requests.
* **Lambda** runs the backend code.
* **S3** stores notes as JSON files.
* **IAM** gives Lambda permission to access S3.

---

## Technologies Used

* Node.js
* AWS Lambda
* Amazon API Gateway
* Amazon S3
* AWS IAM
* AWS SDK for JavaScript

---

## Project Structure

```text
backend/
├── package.json
├── package-lock.json
└── src/
    ├── handler.js
    └── s3.js
```

### `handler.js`

This is the Lambda handler.

It receives the request from API Gateway and decides which operation should be performed.

### `s3.js`

This file contains the S3-related functions:

* Create a note
* Get one note
* Get all notes
* Update a note
* Delete a note

---

## API Endpoints

| Method | Endpoint      | Description   |
| ------ | ------------- | ------------- |
| POST   | `/notes`      | Create a note |
| GET    | `/notes`      | Get all notes |
| GET    | `/notes/{id}` | Get one note  |
| PUT    | `/notes/{id}` | Update a note |
| DELETE | `/notes/{id}` | Delete a note |

---

## Note Format

A note looks like this:

```json
{
    "id": "101",
    "title": "AWS Lambda",
    "content": "Lambda is now running in AWS"
}
```

---

## How Notes Are Stored

Each note is stored as a separate JSON object in S3.

```text
S3 Bucket
└── notes/
    ├── 101.json
    ├── 102.json
    └── 103.json
```

The note ID is used as the filename.

For example:

```text
id: 101
```

becomes:

```text
notes/101.json
```

---

# CRUD Operations

## Create

```text
POST /notes
     ↓
Lambda
     ↓
S3 PutObject
     ↓
101.json
```

The note is saved as a JSON object in S3.

---

## Get All

```text
GET /notes
     ↓
Lambda
     ↓
S3 ListObjectsV2
     ↓
Get each note
```

Lambda lists the objects inside the `notes/` folder and retrieves each note.

---

## Get One

```text
GET /notes/101
     ↓
Lambda
     ↓
S3 GetObject
     ↓
101.json
```

Lambda retrieves the JSON object for the requested note ID.

---

## Update

```text
PUT /notes/101
     ↓
Lambda
     ↓
S3 PutObject
     ↓
101.json is overwritten
```

S3 does not have a separate "update object" operation here.

Instead, the updated JSON is uploaded using the same object key, which overwrites the existing object.

---

## Delete

```text
DELETE /notes/101
     ↓
Lambda
     ↓
S3 DeleteObject
     ↓
101.json is deleted
```

---

# IAM Permissions

The Lambda execution role is given the permissions required to work with the notes.

```text
s3:GetObject
s3:PutObject
s3:DeleteObject
s3:ListBucket
```

Object operations use the notes object path:

```text
arn:aws:s3:::BUCKET_NAME/notes/*
```

Listing objects uses the bucket itself:

```text
arn:aws:s3:::BUCKET_NAME
```

---

# Environment Variable

Lambda uses an environment variable to know which S3 bucket to use:

```text
BUCKET_NAME=your-bucket-name
```

The bucket name is not hard-coded into the application logic.

---

# Local Setup

Install the project dependencies:

```bash
npm install
```

The project uses ES modules.

`package.json` contains:

```json
{
    "type": "module"
}
```

---

# Deploying the Lambda

The Lambda deployment ZIP needs to contain:

```text
src/
package.json
package-lock.json
node_modules/
```

For PowerShell:

```powershell
Compress-Archive -Path src, package.json, package-lock.json, node_modules -DestinationPath lambda.zip -Force
```

Upload `lambda.zip` to the Lambda function.

The Lambda handler is:

```text
src/handler.handler
```

---

# Testing

The API can be tested using:

* Postman
* Thunder Client
* curl
* Browser for GET requests

### Example Request

```text
POST https://YOUR-API-URL/notes
```

Request body:

```json
{
    "id": "101",
    "title": "My First Note",
    "content": "Hello from the Serverless Notes API"
}
```

---

# What This Project Teaches

This project demonstrates the basic flow of a serverless backend:

```text
HTTP Request
     ↓
API Gateway
     ↓
Lambda
     ↓
AWS SDK
     ↓
S3
```

It also provides practical experience with:

* REST API routes
* Lambda handlers
* API Gateway events
* S3 object storage
* AWS SDK
* IAM permissions
* Lambda environment variables
* Serverless CRUD operations
* Deploying Lambda functions using ZIP files

---

# Note

S3 is being used as simple storage for this learning project.

Each note is stored as a separate JSON object.

The project intentionally keeps the architecture simple so that the AWS services and their interactions are easy to understand.
