function Cpaging()
{
	return Cpaging.fn.init();
}
Cpaging.fn=Cpaging.prototype=
{
	contentType: null,
	currentButton:null,
	allTypeMethods: {
		rtc:[Crtc.fn.setRtcList,0],
		gallery:[Cgallery.fn.setGalleryList,1],
		menu:[Cmenu.fn.setMenuList,2],
		page:[Cpage.fn.setPageList,3],
		scenario:[Cscenario.fn.setScenarioList,4],
		extlink:[CextLink.fn.setLinkList,5]
		},
	init:function()
			{
				
				return this.setPagingButtons($_( ".pagingButtons" ));
			},
	setPagingButtons:function(element)
			{
				element
						.buttonset()
						.contents('a')
							.each(function()
							{
								if($_(this).index()==0) $_(this).addClass("ui-state-highlight");
								Cpaging.fn.pagingButtonBind(this);
							});
				return this;
			},
	pagingButtonBind:function(element)
			{
				$_(element).click(function()
					{
						Cpaging.fn.currentButton = this;
						$_(this).addClass("ui-state-highlight")
								.siblings('a')
									.removeClass("ui-state-highlight");
						Cpaging.fn.contentType= $_(Cpaging.fn.currentButton).parents('.ui-tabs').attr('id').toLowerCase().replace('list', '');
						
						var URL = '/admin/ajaxget/'+Cpaging.fn.contentType+'list/'+ $_(this).index()*8;
						Cpaging.fn.ajaxGet(URL, $var.paging.ajaxSuccess2);
					});
				return this;
			},
	ajaxGet:function(url, succ)
			{
				$_.ajax
				({
					url			: url,
					type		: 'post',
					dataType	: 'html',
					success		: succ
				
				});	
			},
	ajaxSuccess1:function(data)
			{
				var elem1=$_('#'+Cpaging.fn.contentType+'listpanel');
				var	elem2=elem1.find('.pagingButtons');
						elem2.siblings('div')
								.remove()
								.end()
							.parent()
								.prepend(data);
				Cpaging.fn.allTypeMethods[Cpaging.fn.contentType][0]();
				$var.breedable.setBreedables();
				var count=elem1.find('input#count').val();
				if(count>8)
				{
					elem2.html('<a>1</a><a>2</a>');
					Cpaging.fn.setPagingButtons(elem2);
				}
			},
	ajaxSuccess2:function(data)
			{
				$_(Cpaging.fn.currentButton)
					.parents('.pagingButtons')
						.siblings('div')
							.remove()
							.end()
						.parent()
							.prepend(data);
				Cpaging.fn.allTypeMethods[Cpaging.fn.contentType][0]();
				$var.breedable.setBreedables();
				var rdata ={
					current:$_(Cpaging.fn.currentButton).parents('.pagingButtons'),
					count: $_(Cpaging.fn.currentButton).parents('.ui-tabs-panel').find('input#count').val()
					}
					Cpaging.fn.refreshPaging(rdata);
			},
	refresh:function(type, page)
			{
				//var btn = $_( ".pagingButtons" ).eq(this.allTypeMethods[type][1]).find('a').eq(page-1)ui-state-highlight
				var btn = $_( ".pagingButtons" ).eq(this.allTypeMethods[type][1]).find('a.ui-state-highlight');
				if(btn.length)
				{
					btn.click();
					return this;
				}
				var URL = '/admin/ajaxget/'+type+'list/0';
				Cpaging.fn.contentType=type;
				Cpaging.fn.ajaxGet(URL, $var.paging.ajaxSuccess1);
							
							
				
			},
	refreshPaging:function(data)
			{
				if(data.count<=8)
				{
					data.current.html('');
					return true;
				}
				var c =data.current.children('a').size();
				var f =Math.ceil(data.count/8);
				if( c<f )
					for(i=1; i<=(f-c); i++)
						data.current.children('a:last')
								.after(function()
								{
									var cloned = $_(this).clone(true);
									cloned
										.removeClass('ui-state-highlight')
										.find('.ui-button-text').html(($_(this).index()+2));
									return cloned;
								})
				return this;
			}
};

$_(function(){
$var.paging= new Cpaging();

});
