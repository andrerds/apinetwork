const domainPing = require("domain-ping");
const admin = require('firebase-admin');
const { response } = require('express');
const app = require("express")();
const port = 4000

let serviceAccount = require('./rds-informatica-dff32377287a.json');
 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();
app.get("/dominios", function(request, response){
    db.collection('dominios').get().then((res ) => {
        let data = [];
        res.forEach((doc) => {
            data.push({
                id: doc.id,
                dominio: doc.data().dominio
            });
            let result = [];
            data.forEach(element => {
               domainPing(element.dominio).then((res) => {
                 return result.push(res)
               }).catch(e => console.log(e)) ;
              
            });
            response.json(result);
        })
        
     }).catch(err => { console.log(err)});
})
 
// 
// dominios = ['posts.vix.br', 'google.com.br', 'facebook.com'];

// console.log(dominios);

// // Fazendo um loop para cada Interação 
// dominios.forEach(element => {
//     const check = domainPing(element).then((res) => {
//         console.log(res)
//     }).catch(e => console.log(e));
// return check;
// });
// return dominios;
module.exports = app;
