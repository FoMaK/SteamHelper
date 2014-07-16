// ==UserScript==
// @name	Steam Market SELL&BUY Helper
// @namespace	Steam/MSBH
// @version	0.8
// @author	FoMa
// @description	check name
// @include	http*://steamcommunity.com/profiles/*/inventory/*
// @include	http*://steamcommunity.com/market/listings/*/*
// @icon	http://steamcommunity.com/favicon.ico
// ==/UserScript==

jQuery(function($) {

	//auto agree with buy/sell terms
	$('#market_sell_dialog_accept_ssa, #market_buynow_dialog_accept_ssa').attr('checked', true);
	
	//get sell lower price from page
	function getSellPrice(){
		var text = $('#tabcontent_inventory .inventory_iteminfo:visible .item_market_actions > div').text();
		return text.match(/\d+[\.,]?\d*/);
	}

	//autocomplete sell price in modal window
	unsafeWindow.SellCurrentSelection = function(price) {
		SellItemDialog.Show(g_ActiveInventory.selectedItem);
		
		if (price == null)
			price = getSellPrice();
		
		$('#market_sell_buyercurrency_input').val(price);
		SellItemDialog.OnBuyerPriceInputKeyUp();
		
		$('#market_sell_buyercurrency_input').focus().select();
	}
	
	var _PopulateMarketActions = unsafeWindow.PopulateMarketActions;
	
	unsafeWindow.PopulateMarketActions = function ( elActions, item ) {
		_PopulateMarketActions(elActions, item);
		
		var lastSellPrice = localStorage.getItem(item.appid + '#' + item.classid);
		if (lastSellPrice != null) {
			var elLastPrice = new Element('div', { 'style': 'margin-top: 1em' })
									.appendChild(
										CreateMarketActionButton('green', 'javascript:FastSellCurrentSelection(' + parseFloat(lastSellPrice.replace(',', '.')) + ')', 'qs# ' + lastSellPrice)
									);
			elActions.appendChild(elLastPrice);
		}
	}

	$('#market_sell_dialog_ok').on('click', function (){
		var item = g_ActiveInventory.selectedItem;
		localStorage.setItem(item.appid + '#' + item.classid, $('#market_sell_buyercurrency_input').val());
	});
});

unsafeWindow.FastSellCurrentSelection = function (value) {
	SellCurrentSelection(value);
	
	setTimeout(function() {
		document.querySelector('#market_sell_dialog_accept').click();
		document.querySelector('#market_sell_dialog_ok').click();
	}, 400); 
}
	
