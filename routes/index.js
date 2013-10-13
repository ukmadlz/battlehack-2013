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
    }
	pp.authorizePayment(callbacks);
}

exports.echo = function(req,res){
	res.json(req.query);
}