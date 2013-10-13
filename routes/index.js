var pp = require('../lib/paypal.js')

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.authorize = function(req,res){
	callbacks = {
        authorizePaymentError: function(err){
            res.json({
            	status: 'error',
            	data: err
            });
        },
        authorizePaymentSuccess: function(data){
            res.json({
            	status: 'not error',
            	data: data
            });
        }
    };
	pp.authorizePayment(callbacks);
}

exports.takePayment = function(req,res){
    callbacks = {
        takePaymentError: function(err){
            res.json({
                status: 'error',
                data: err
            });
        },
        takePaymentSuccess: function(data){
            res.json({
                status: 'not error',
                data: data
            });
        }
    };
    pp.takePayment(callbacks,req.query.token,req.query.price,req.query.payer_id);
}

exports.echo = function(req,res){
	res.json(req.query);
}