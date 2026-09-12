import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    ListObjectsV2Command
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
    region: "eu-north-1"
});

const BUCKET_NAME = process.env.BUCKET_NAME;


// CREATE
export async function createNote(note) {
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `notes/${note.id}.json`,
        Body: JSON.stringify(note),
        ContentType: "application/json"
    });

    await s3.send(command);
}


// GET ONE
export async function getNote(id) {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `notes/${id}.json`
    });

    const response = await s3.send(command);

    const body = await response.Body.transformToString();

    return JSON.parse(body);
}


// UPDATE
export async function updateNote(note) {
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `notes/${note.id}.json`,
        Body: JSON.stringify(note),
        ContentType: "application/json"
    });

    await s3.send(command);
}


// DELETE
export async function deleteNote(id) {
    const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `notes/${id}.json`
    });

    await s3.send(command);
}


// GET ALL
export async function getAllNotes() {
    const command = new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: "notes/"
    });

    const response = await s3.send(command);

    const notes = [];

    for (const object of response.Contents ?? []) {
        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: object.Key
        });

        const response = await s3.send(command);

        const body = await response.Body.transformToString();

        notes.push(JSON.parse(body));
    }

    return notes;
}