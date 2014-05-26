/*
 * 
 * jQuery Amortization Schedule Calculator
 * By: Sandro Dzneladze [http://idev.ge]
 *
 * Copyright 2014 Sandro Dzneladze
 *  
 * You may use this project under MIT license.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *  
 */

(function($) {
    $.fn.amortizationSchedule = function(options) {

        var settings = $.extend({/* Defaults */},options);

        var controlsHtml = '<div class="loan">' +
                               '<div class="input-group">' +
                                    '<span class="input-group-addon">Loan Amount</span>' +
                                    '<input type="text" class="form-control" placeholder="e.g. 3800" id="amortization-schedule-amount" />' +
                                    '<span class="input-group-addon input-group-addon-right">USD</span>' +
                               '</div>' +
                               '<div class="input-group">' +
                                    '<span class="input-group-addon">Interest</span>' +
                                    '<input type="text" class="form-control" placeholder="e.g. 32" id="amortization-schedule-interest" />' +
                                    '<span class="input-group-addon input-group-addon-right">%</span>' +
                               '</div>' +
                               '<div class="input-group">' +
                                    '<span class="input-group-addon">Duration</span>' +
                                    '<input type="text" class="form-control" placeholder="e.g. 48" id="amortization-schedule-duration" />' +
                                    '<span class="input-group-addon input-group-addon-right">Month</span>' +
                                '</div>' +
                                '<div class="input-group">' +
                                    '<span class="input-group-addon">Grace Period</span>' +
                                    '<input type="text" class="form-control" placeholder="e.g. 0" id="amortization-schedule-grace" />' +
                                    '<span class="input-group-addon input-group-addon-right">Month</span>' +
                                '</div>' +
                           '</div>' +
                           '<div class="date">' +
                                 '<div class="input-group">' +
                                    '<span class="input-group-addon">Start Month</span>' +
                                    '<input type="text" class="form-control" placeholder="e.g. 12" id="amortization-schedule-month" />' +
                                 '</div>' +
                                 '<div class="input-group">' +
                                    '<span class="input-group-addon">Start Day</span>' +
                                    '<input type="text" class="form-control" placeholder="e.g. 28" id="amortization-schedule-day" />' +
                                 '</div>' +
                                 '<div class="input-group">' +
                                    '<span class="input-group-addon">Start Year</span>' +
                                    '<input type="text" class="form-control" placeholder="e.g. 2014" id="amortization-schedule-year" />' +
                                 '</div>' +
                           '</div>' +
                           '<button type="button" class="btn btn-success btn-lg" id="amortization-schedule-submit">Calculate</button>';
        $('#'+settings.controlsID).append(controlsHtml);

        $('#amortization-schedule-submit').on('click', function(){
            calculate();
            return false;
        });

        var me = this;
        function calculate() {
            var loanAmount = parseInt($('#amortization-schedule-amount').val()),
                loanInterest = parseInt($('#amortization-schedule-interest').val()), // %
                loanDuration = parseInt($('#amortization-schedule-duration').val()), // Month
                loanGrace = parseInt($('#amortization-schedule-grace').val()), // Month
                loanFee = parseInt($('#amortization-schedule-fee').val()), // %
                loanInitMonth = parseInt($('#amortization-schedule-month').val()),
                loanInitDay = parseInt($('#amortization-schedule-day').val()),
                loanInitYear = parseInt($('#amortization-schedule-year').val());

            var loanStart = new Date(loanInitYear,loanInitMonth,loanInitDay);
            var loanTable = [];

            // Create array of the schedule
            var i = 0;
            for (var m = loanInitMonth; m < loanDuration + loanInitMonth; m++) {
                // date
                var d = new Date(loanStart.getTime());
                d.setMonth(m);
                // percent
                if (i > loanGrace) {
                    var pmt = PMT((loanInterest/100)/12,loanDuration-loanGrace,loanAmount);
                    var ipmt = IPMT(loanAmount,pmt,(loanInterest/100)/12,i-loanGrace);
                    var p = -ipmt;
                } else {
                    var p = loanAmount * (loanInterest/100) / 12
                }
                // installment
                if (i >= loanGrace) {
                    var inst = -PMT((loanInterest/100)/12,loanDuration-loanGrace,loanAmount);
                } else {
                    var inst = p;
                }
                // base
                var b = inst - p;
                // balance
                if (i == 0) {
                    var c = loanAmount - b;
                } else {
                    var c = loanTable[i-1].balance - b;
                }
                // hash
                loanTable.push({date:d,base:b,percent:p,installment:inst,balance:c});
                //
                i++;
            }
            // Transform into html
            var loanTableTd = [];
            for (var t = 0; t < loanTable.length; t++) {
                loanTableTd.push((t == 0 ? '<table class="table"><thead><tr><th>#</th><th>Date</th><th>Base</th><th>Percent</th><th>Installment</th><th>Balance</th></tr></thead><tbody>' : '') + '<tr><td>'
                                          + (t + 1) +'</td><td>'
                                           + formatDate(loanTable[t].date) +'</td><td>'
                                            + roundTo2(loanTable[t].base) +'</td><td>'
                                             + roundTo2(loanTable[t].percent) +'</td><td>'
                                              + Math.round(loanTable[t].installment) +'</td><td>'
                                               + roundTo2(loanTable[t].balance) +'</td></tr>' + (t == loanTable.length - 1 ? '</tbody></table>' : ''));
            }
            // Insert into dom
            $(me).find('table').remove();
            $(me).append(loanTableTd.join(''));
        }

        // Helper functions
        function formatDate(date) {
            return String(date).substr(4,12);
        }
        function roundTo2(num) {
            return Math.round(num * 100) / 100;
        }
        function PMT(rate,nper,pv,fv,type) {
            // PMT excel function taken from https://gist.github.com/pies/4166888
        	if (!fv) fv = 0;
        	if (!type) type = 0;
        	if (rate == 0) return -(pv + fv)/nper;
        	var pvif = Math.pow(1 + rate, nper);
        	var pmt = rate / (pvif - 1) * -(pv * pvif + fv);
        	if (type == 1) {
        		pmt /= (1 + rate);
        	};
        	return pmt;
        }
        function IPMT(pv,pmt,rate,per) {
            // PMT excel function taken from https://gist.github.com/pies/4166888
        	var tmp = Math.pow(1 + rate, per);
        	return 0 - (pv * tmp * rate + pmt * (tmp - 1));
        }
        
    }
}(jQuery));