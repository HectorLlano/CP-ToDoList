import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const apiUrl = "http://localhost:4000"

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});

app.get("/", async (req, res) => {
    try {
      const response = await axios.get(`${apiUrl}/toDoList`);
      res.render("index.ejs", { toDoList: response.data });
    } catch (error) {
      res.status(500).json({ message: "Error fetching posts" });
    }
});

app.post("/api/post", async (req, res) => {
  try {
    const response = await axios.post(`${apiUrl}/post`, req.body);
    //console.log(response.data);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error creating post" });
}});

app.get("/api/delete/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const response = await axios.delete(`${apiUrl}/delete/${req.params.id}`);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});