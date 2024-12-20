import express from "express";
import mongoose from "mongoose";

mongoose.connect("mongodb+srv://gayu24:gayu24@cluster0.dyqlk.mongodb.net/seriesdb").then(()=>console.log("Database connected"));

const app = express();
app.use(express.json());
const seriesSchema = new mongoose.Schema({
    seriesname:String
})

const Series = mongoose.model("series",seriesSchema);

app.get("/series",async (req,res)=>{
    let series;
    try{
        series = await Series.find();
        if(series.length === 0){
            return res.status(404).json({message:"series not found"});
        }
        return res.status(200).json(series);
    }catch(err){
        console.log(err);
        return res.status(500).json({error:"Server error"});
    }
})
app.get("/:seriesid",async(req,res)=>{
    let id = req.params.seriesid;
    let series;
    try {
        series = await Series.findById(id);
        if(!series){
            return res.status(404).json({message:"No series found with this id"});
        }
        return res.status(200).json(series);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Server error"});
    }
})

app.post("/create-series",async (req,res)=>{
    let seriesname = req.body.seriesname;
    try{
        let series = new Series({
            seriesname:seriesname
        })
        series.save();
        return res.status(201).json({message:"series created succefully"});
  }catch(err){
        console.log(err);
        return res.status(500).json({error:"Server error"});
    }
})

app.put("/update-series/:seriesid",async(req,res)=>{
    let id = req.params.seriesid;
    let seriesname = req.body.seriesname;
    let series;
    try {
        series = await Series.findByIdAndUpdate(id,{seriesname:seriesname});
        if(!series){
            return res.status(404).json({message:"No series found with this id"});
        }
        return res.status(200).json({message:"series updated successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Server error"});
    }
})

app.delete("/delete-series/:seriesid",async(req,res)=>{
    let id = req.params.seriesid;
    let series;
    try{
        series = await Series.findByIdAndDelete(id);
        if(!series){
            return res.status(404).json({message:"No series found with this id"})
        }
        return res.status(200).json({message:"series deleted successfully"});
    }catch(err){
        console.log(err);
        return res.status(500).json({error:"Server error"});
    }
})



app.listen(3000,()=>console.log("Server started @ 3000"))
