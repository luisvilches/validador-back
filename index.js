const express = require('express');
const app = express();
const cors = require('cors');
const multiparty = require('connect-multiparty');
const body = multiparty();
const request = require('request');
const css = require('w3c-css');
const translate = require('google-translate-api');
const validate = require('html5-validator')

const puerto = process.env.PORT || 5000;

app.use(cors());


app.get('/',(req,res) => {
	res.status(200).json({message:"Hello World!!"});
});

app.post('/comments',body,(req,res) => {
	var i = req.body.url.split('://');
	var url;

	if(i[0] === "http"){
		url = req.body.url;
	} else if(i[0] === "https"){
		url = req.body.url;
	} else {
		url = "http://" + req.body.url;
	}
	let admin = 's4ntander';
	let pass = 'ec0000';

	//var auth = "Basic " + new Buffer(req.body.user + ":" + req.body.pass).toString("base64");
	var auth = "Basic " + new Buffer(admin + ":" + pass).toString("base64");

	request(url, {
		headers : {
            "Authorization" : auth
        }
	},(err,response,body) => {
		console.log(body)
		if (err){
			if (err.code === "ENOTFOUND"){
				res.status(500).json({message:"Dominio ingresado no existe"});
			} else {
				console.log('error del servidor');
			}
		} else {
			let errores = [];
			let cadena = body.split("\n");
			let position = 0;	

			cadena.forEach((item,index) => {
				console.log(item)
				position = index;
				if(item.indexOf("<!--") > -1){
					errores.push({state:"error",line:index,item:String(item)});
				} else if(item.indexOf("-->") > -1){
					errores.push({state:"error",line:index,item:String(item)});
				} else if(position === cadena.length - 1){
					res.status(200).json({message:"Success",total:errores.length,errores:errores});
				};
			});
		}		
	});
});
/*
app.post('/css',body,(req,res) => {
	var i = req.body.url.split('://');
	var url;

	if(i[0] === "http"){
		url = req.body.url;
	} else if(i[0] === "https"){
		url = req.body.url;
	} else {
		url = "http://" + req.body.url;
	}

	var auth = "Basic " + new Buffer(req.body.user + ":" + req.body.pass).toString("base64");

	css.validate(url,{
		headers : {
            "Authorization" : auth
        }
	}, function(err, result) {

		if(err) {
		    console.error(err);
		} else {
			res.status(200).json({message:"Success",data:result});
		}
	 
	});
});

app.post('/html',body,(req,res) => {
	var i = req.body.url.split('://');
	var url;

	if(i[0] === "http"){
		url = req.body.url;
	} else if(i[0] === "https"){
		url = req.body.url;
	} else {
		url = "http://" + req.body.url;
	}

	var auth = "Basic " + new Buffer(req.body.user + ":" + req.body.pass).toString("base64");

	validate(url).then(result => {
	  res.status(200).json({message:"Success",data:result});
	});
});*/

app.listen(puerto,err => {
	if(err) throw err;
	console.log('running in port 5000');
});