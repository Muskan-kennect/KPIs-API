const { ObjectId } = require("mongodb");
const client = require("../config/dbConnection");

const addDraft = async(req,res)=>{

    const document = req.body;
    try {
        await client.connect(); // Connect to the MongoDB database
        const db = client.db(process.env.MONGODB_DB); // Specify the database name
        const collection = db.collection('draft'); // Change to your collection name
        const result = await collection.insertOne(document);
        console.log(`Document inserted with _id: ${result.insertedId}`);
        res.status(200).json({ message: 'Document inserted successfully' });
    } catch (err) {
        console.error(`Error inserting document: ${err}`);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close(); // Close the MongoDB client connection
    }
};
const getAllDrafts = async (req, res) => {
    const { offset = 0, limit = 8, filterLabels } = req.query; 
    try {
        await client.connect(); 
        const db = client.db(process.env.MONGODB_DB); 
        const collection = db.collection('draft');
        
        let query = {}; 
        if (filterLabels !== undefined && filterLabels !== '') {
            const labelsArray = filterLabels.split(','); 
            query = { 'labels': { $in: labelsArray } }; 
        }
        console.log("query",query)
        console.log(offset,limit)
        let drafts ;
        if(query){
            drafts = await collection.find(query)
            .skip(parseInt(offset))
            .limit(parseInt(limit))
            .toArray(); // Retrieve documents with pagination
        }
        else{
            drafts = await collection
            .skip(parseInt(offset))
            .limit(parseInt(limit))
            .toArray(); // Retrieve documents with pagination
        }
       
        res.status(200).json(drafts); // Send the retrieved documents as JSON response
    } catch (err) {
        console.error(`Error retrieving documents: ${err}`);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close(); // Close the MongoDB client connection
    }
};


const deleteDraft = async (req, res) => {
    const { id } = req.params;
    try {
        await client.connect(); // Connect to the MongoDB database
        const db = client.db(process.env.MONGODB_DB); // Specify the database name
        const collection = db.collection('draft'); // Change to your collection name
        const result = await collection.deleteOne({ _id: new ObjectId(id) }); // Delete the draft with the specified ID
        if (result.deletedCount === 1) {
            res.status(200).json({ message: 'Draft deleted successfully' }); // Send success message if draft is deleted
        } else {
            res.status(404).json({ error: 'Draft not found' }); // Send error message if draft is not found
        }
    } catch (err) {
        console.error(`Error deleting document: ${err}`);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close(); // Close the MongoDB client connection
    }
};

const updateDraft = async (req, res) => {
    const { id } = req.params; 
    const  {isPublished,body,isRevised} = req.body; 
    try {
        await client.connect(); 
        const db = client.db(process.env.MONGODB_DB); 
        const collection = db.collection('draft'); 
        const result = await collection.updateOne(
            { _id: id}, 
            { $set: { isPublished } } 
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Draft not found' });
        }
        console.log(`Document with _id ${id} updated`);
        res.status(200).json({ message: 'Draft updated successfully' });
    } catch (err) {
        console.error(`Error updating document: ${err}`);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
};

const saveDraftEditUpdate = async (req, res) => {
    const { id } = req.params; 
    const  setup = req.body; 

    try {
        await client.connect(); 
        const db = client.db(process.env.MONGODB_DB); 
        const collection = db.collection('draft'); 
        const result = await collection.updateOne(
            { _id: id}, 
            { $set: { setup } } 
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Draft not found' });
        }
        console.log(`Document with _id ${id} updated`);
        res.status(200).json({ message: 'Draft updated successfully' });
    } catch (err) {
        console.error(`Error updating document: ${err}`);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
};

const getDraftsByQuery = async (req, res) => {
    const { query } = req.query; // Extract the query string from the request query

    try {
        await client.connect(); // Connect to the MongoDB database
        const db = client.db(process.env.MONGODB_DB); // Specify the database name
        const collection = db.collection('draft'); // Change to your collection name
        
        // Find drafts where the name or displayName contains the query string
        const drafts = await collection.find({
            $or: [
                { name: { $regex: query, $options: 'i' } }, // Case-insensitive search for name
                { displayName: { $regex: query, $options: 'i' } } // Case-insensitive search for displayName
            ]
        }).toArray();

        res.status(200).json(drafts); // Send the matching drafts as JSON response
    } catch (error) {
        console.error('Error searching drafts:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close(); // Close the MongoDB client connection
    }
};


const getDraftById = async (req, res) => {
    const { id } = req.params; // Extract the id parameter from the request URL
    
    try {
        await client.connect(); // Connect to the MongoDB database
        const db = client.db(process.env.MONGODB_DB); // Specify the database name
        const collection = db.collection('draft'); // Change to your collection name
        const draft = await collection.findOne({ _id: id }); // Retrieve the document with matching _id
        if (!draft) {
            // If no document found with the specified _id, return 404 Not Found
            return res.status(404).json({ error: 'Draft not found' });
        }
        res.status(200).json(draft); // Send the retrieved document as JSON response
    } catch (err) {
        console.error(`Error retrieving document: ${err}`);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close(); // Close the MongoDB client connection
    }
};

module.exports={addDraft,getAllDrafts,deleteDraft,updateDraft,getDraftById,saveDraftEditUpdate,getDraftsByQuery}