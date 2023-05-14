import Product from "../models/EtalasalleModels.js";
import path from "path";
import fs from "fs";
import { Op } from "sequelize";
import Etalasalle from "../models/EtalasalleModels.js";

export const getProducts = async (req, res) => {
  try {
    const response = await Etalasalle.findAll();
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getProductById = async (req, res) => {
  try {
    const response = await Etalasalle.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const createProduct = async (req, res) => {
  if (req.files === null)
    return res.status(400).json({ msg: "No File Uploaded" });
  const name = req.body.title;
  const file = req.files.file;
  const fileSize = file.size;
  const ext = path.extname(file.name);
  const fileName = name + file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  const allowedType = [".png", ".jpg", "jpeg"];

  if (!allowedType.includes(ext.toLocaleLowerCase()))
    return res.status(422).json({ msg: "Invalid Images" });
  if (fileSize > 5000000)
    return res.status(422).json({ msg: "Image must be less than 5 MB" });
  file.mv(`./public/images/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.messages });

    try {
      await Product.create({
        name: name,
        image: fileName,
        url: url,
        description: req.body.description,
        price: req.body.price,
        type: req.body.type,
        contactname: req.body.contactname,
        contactnumber: req.body.contactnumber,
      });
      res.status(201).json({ msg: "created" });
    } catch (error) {
      console.log(error.message);
    }
  });
};

export const deleteProduct = async (req, res) => {
  const product = await Etalasalle.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!product) return res.status(404).json({ msg: "Not found" });

  try {
    const filepath = `./public/images/${product.image}`;
    fs.unlinkSync(filepath);
    await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Product Deleted" });
  } catch (error) {
    console.log(error.message);
  }
};

export const updateProduct = async (req, res) => {
  const product = await Etalasalle.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!product) return res.status(404).json({ msg: "Not found" });
  let fileName = "";
  if (req.files === null) {
    fileName = product.image;
  } else {
    const name = req.body.title;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = name + file.md5 + ext;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 5000000)
      return res.status(422).json({ msg: "Image must be less than 5 MB" });

    const filepath = `./public/images/${product.image}`;
    fs.unlinkSync(filepath);

    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }
//  const name = req.body.title;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

  try {
    await Product.update(
      { name: name, 
        image: fileName, 
        url: url,
        description: req.body.description,
        price: req.body.price,
        type: req.body.type,
        contactname: req.body.contactname,
        contactnumber: req.body.contactnumber,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: "Product Updated Successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

export const searchProducts = async (req, res) => {
    const query = req.query.q;
  
    try {
      const response = await Etalasalle.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${query}%` } },
            { description: { [Op.like]: `%${query}%` } },
          ],
        },
      });
  
      res.json(response);
    } catch (error) {
      console.log(error.message);
    }
  };

  export const getProductsByType = async (req, res) => {
    try {
      const response = await Etalasalle.findAll({
        where: {
          type: req.params.type,
        },
      });
      res.json(response);
    } catch (error) {
      console.log(error.message);
    }
  };

  export const previewProductsByType = async (req, res) => {
    try {
      const response = await Etalasalle.findAll({
        where: {
          type: req.params.type,
        },
        order: [['createdAt', 'DESC']],
        limit: 4,
      });
      res.json(response);
    } catch (error) {
      console.log(error.message);
    }
  };

  export const getNewestProducts = async (req, res) => {
    try {
      const response = await Etalasalle.findAll({
        order: [['createdAt', 'DESC']],
        limit: 4,
      });
      res.json(response);
    } catch (error) {
      console.log(error.message);
    }
  };