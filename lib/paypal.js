var config = require('config');
var paypal_sdk = require('paypal-rest-sdk');

paypal_sdk.configure(config.paypal);

var transactionID;

exports.authorizePayment = function(callbacks){
    console.log('paymentcalled');
    paypal_sdk.payment.create({
          "intent":"authorize",
          "payer":{
            "payment_method":"paypal"
          },
          "redirect_urls":{
            "return_url":"https://battlehack-paypal.herokuapp.com/game.html",
            "cancel_url":"http://hunterp13.files.wordpress.com/2013/04/elijah-wood-01.jpg"
          },
          "transactions":[
            {
              "amount":{
                "total":"100.00",
                "currency":"GBP"
              }
            }
          ]
        },
        {},
        function(err, data){
            if(err){
                console.log('You FUUUUUUCKED UP!: '+err);
                callbacks.authorizePaymentError(data);
            }
            else{
                console.log('a thing did do an occur...');
                callbacks.authorizePaymentSuccess({id:data.id,authurl:data.links[1]});
                transactionID = data.id;
            }
        }
    );
}

exports.takePayment = function(callbacks,price,payerid){
    if(transactionID != undefined){
        paypal_sdk.payment.execute(transactionID,{
          payer_id:payerid
        },
        {},
        function(err, data){
          if(err){
                console.log('You FUUUUUUCKED UP!: '+err);
                callbacks.takePaymentError(err);
            }
            else{
                console.log('a thing did do an occur...');
                callbacks.takePaymentSuccess(data);
            }
        });
    }
    else{
        callbacks.takePaymentError("you done a bad ting: haven't set your transaction ID");
    }
}

