function verticalPanel()
{
	return verticalPanel.fn.init();
}
verticalPanel.fn=verticalPanel.prototype=
{
	Slider	: null, 
	Accordion : null,
	Slidericon : null,
	Slidericons : null,
	init : function()
			{
				
				this.Slider	= $_('#verticalPanel_silder');
				this.Accordion = $_('#verticalPanel_accordion');
				this.Slidericon = $_('#verticalPanel_silder_icon');
				this.Slidericons = {
								header: "ui-icon-circle-arrow-e",
								headerSelected: "ui-icon-circle-arrow-s"
							};
				this.state = 'statusOpen',	this.active= 1;
				if($_.cookie('vpanel_state')!=null) this.state = $_.cookie('vpanel_state');
				if($_.cookie('vpanel_active')!=null) this.active= parseInt($_.cookie('vpanel_active'));
				this.doaccordion().bind().accorAutoHeight().winResizeBind();
				setTimeout('verticalPanel.fn["'+this.state+'"]('+this.active+')', 1000);
			},
	doaccordion: function()
			{
				this.Accordion.accordion({
					animated: 'bounceslide',
					//active: this.active,
					fillSpace: true,
					icons: this.Slidericons,
					changestart: function(event, ui) { verticalPanel.fn.setCoockie('active', $_(this).accordion( "option", "active" )); }
				});
				return this;
			},
	accorAutoHeight: function()
			{
				$_('#verticalPanel_silder, #verticalPanel').height($_(window).height()-33);
				verticalPanel.fn.Accordion.accordion("resize");
				return this;
			},
	accorIndex : function()
			{
				if(typeof this.index == 'undefined') return false;
				this.Accordion.accordion( "activate" , this.index );
			},
	winResizeBind: function()
			{
				$_(window).resize(this.accorAutoHeight);
				return this;
			},
	bind : function()
			{
				this.Slider.click(this.toggleStatus);
				return this;
			},
	toggleStatus:function()
			{
				if(verticalPanel.fn.Slider.css('left')=='250px') verticalPanel.fn.close();
				if(verticalPanel.fn.Slider.css('left')=='0px') verticalPanel.fn.open( parseInt($_.cookie('vpanel_active')) );
			},		
	close : function()
			{
				if(this.Slider.css('left')!='250px') return false;
				this.Accordion.hide("slide", { direction: "left" }, 2000);
				this.Slider.animate({"left": "-=250px"}, 2000);
				this.Slider.find('span')
						.removeClass('ui-icon-triangle-1-w')
						.addClass('ui-icon-triangle-1-e');	
				return this.setCoockie('state', 'statusClose');
			},
	setCoockie:function(name, value)
	{
		$_.cookie('vpanel_'+name, null);
		$_.cookie('vpanel_'+name, value, { expires: 7, path: '/admin' });
		return this;
	},
	open : function(index)
			{
				
				this.index = index;
				if(this.Slider.css('left')!='0px')
				{
					this.accorIndex();
					this.attention(index);
					return false;
				}
				setTimeout('$var.vPanel.accorIndex()',2000); 
				this.Accordion.show("slide", { direction: "left" }, 2000);
				this.Slider.animate({"left": "+=250px"}, 2000);	
				this.Slider.find('span')
						.removeClass('ui-icon-triangle-1-e')
						.addClass('ui-icon-triangle-1-w');	
				return this.setCoockie('state', 'statusOpen')/*.accorAutoHeight()*/;
			},
	statusClose : function(index)
			{
				this.Accordion/*.accordion( "activate" , index )*/.css('display', 'none');
				this.Slider.css('left', '0px');
				this.Slidericon.removeClass('ui-icon-triangle-1-w')
								.addClass('ui-icon-triangle-1-e');
				return this;
			},
	statusOpen : function(index)
			{
				this.Accordion.css('display', 'block').accordion( "activate" , index );
				this.Slider.css('left', '250px');
				this.Slidericon.removeClass('ui-icon-triangle-1-e')
								.addClass('ui-icon-triangle-1-w');	
				return this;
			},
	attention:function(index)
			{
			var element = $_('.ui-accordion-header').eq(index).children('a')
			var data1= {"color":"#FF0000","font-size":"+=3px"};
			var data2= {"color":"#212121","font-size":"-=3px"};
			element
					.animate(data1,"fast")
						.animate(data2,"fast")
					.animate(data1,"fast")
						.animate(data2,"fast")

			return this;				
			}
};
