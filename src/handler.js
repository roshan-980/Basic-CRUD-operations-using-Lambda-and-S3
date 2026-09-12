import {
    createNote,
    getNote,
    updateNote,
    deleteNote,
    getAllNotes
} from "./s3.js";


export const handler = async (event) => {
    try {
        const method = event.requestContext.http.method;
        const id = event.pathParameters?.id;

        let body = null;

        if (event.body) {
            body = JSON.parse(event.body);
        }


        // POST /notes
        if (method === "POST" && !id) {
            if (!body?.id || !body?.title || !body?.content) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        message: "id, title and content are required"
                    })
                };
            }

            const note = {
                id: body.id,
                title: body.title,
                content: body.content
            };

            await createNote(note);

            return {
                statusCode: 201,
                body: JSON.stringify({
                    message: "Note created successfully",
                    note
                })
            };
        }


        // GET /notes
        if (method === "GET" && !id) {
            const notes = await getAllNotes();

            return {
                statusCode: 200,
                body: JSON.stringify(notes)
            };
        }


        // GET /notes/{id}
        if (method === "GET" && id) {
            const note = await getNote(id);

            return {
                statusCode: 200,
                body: JSON.stringify(note)
            };
        }


        // PUT /notes/{id}
        if (method === "PUT" && id) {
            if (!body?.title || !body?.content) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        message: "title and content are required"
                    })
                };
            }

            const note = {
                id,
                title: body.title,
                content: body.content
            };

            await updateNote(note);

            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: "Note updated successfully",
                    note
                })
            };
        }


        // DELETE /notes/{id}
        if (method === "DELETE" && id) {
            await deleteNote(id);

            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: "Note deleted successfully"
                })
            };
        }


        // Route not found
        return {
            statusCode: 404,
            body: JSON.stringify({
                message: "Route not found"
            })
        };

    } catch (error) {
        console.error("Error:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Internal server error"
            })
        };
    }
};