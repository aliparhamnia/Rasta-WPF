function Cmenu()
	{
		return Cmenu.fn.init();
	}
Cmenu.fn=Cmenu.prototype=
{
	buffer	:null,
	editstatus:'off',
	init:function()
			{
				this.getMenus().setListTools();
				return this;
			},
	setListTools:function()
						{
							setListTools('#menulistpanel .listtools',this.newBind);
							return this;
						},
	New:function()
			{
				Cmenu.fn.prepareMenu('new');
				var pageButtonSet 	= lang.aa;
				$_('#menulist').find('div#tabs-1').prepend(pageButtonSet);
				var newPageElem = $_('#menulist .rasta-buttonset:first').children('a');
				Cmenu.fn.setMenuButtonSet(newPageElem.last())
						.allButtonUnbind([0,1,2])
						.setSaveButton(newPageElem.first())
						.saveButtonBind(newPageElem.first())
						.setCancelButton(newPageElem.first())
						.cancelButtonBind(newPageElem.first())
						.deleteButtonBind(newPageElem.first())
				return this;
			},
	prepareMenu:function(state,id,page_id )
			{	
				if (state=='new')
				{
					var disableDiv	= '<div id="disable_container" class="ui-widget-overlay"'
									+ 'style="width: 100%; height: 120%; z-index: 1001;"></div>';				
					$_('#container').prepend(disableDiv);
					$_('ul.createmenu').html(lang.ap);
					$_('#createmenu').show();
					$_( "#menulist" ).tabs( "option", "selected", 0 );
				}
				else if (state=='cancel')
				{
					$_('#container #disable_container').remove();
					$_('ul.createmenu').html('');
					$_('#createmenu').hide();
				}
				else if (state=='save')
				{
					$_('#container #disable_container').remove();
					$_('#createmenu').hide();
					$_('ul.createmenu').html('');
				}
				else if (state=='edit')
				{
					var disableDiv	= '<div id="disable_container" class="ui-widget-overlay"'
									+ 'style="width: 100%; height: 120%; z-index: 1001;"></div>';				
					$_('#container').prepend(disableDiv);

					$_.ajax
					({
						url			: '/admin/ajaxget/geteditmenu',
						type		: 'post',
						dataType	: 'html',
						data		: {'id': id ,'page_id': page_id },
						success		: function(msg)
										{
											$_('ul.createmenu').html(msg);

											$_('#createmenu')
													.show()
													.find('li').has('div')
														.children('a')
														.addClass('parent');
														
											$var.breedable
													.setBreedables()
													.sortableCreateMenu();
											$_( "#menulist" ).tabs( "option", "selected", 0 );
										} 
					
					});	
				}
				$var.breedable.setBreedables();
			},
	newBind:function()
			{
				Cmenu.fn.New();
				return this;
			},
	getMenus:function()
			{
				
				Cmenu.fn.setMenuList();
				return this;
			},
	setMenuList:function()
			{
				$_('#menulist .menutitle')
					.each(function()
					{
						Cmenu.fn.setMenuButtonSet(this);
					});
				return this;
			},
	setMenuButtonSet:function(elem)
			{
						$_(elem)
							.button()
							.click(function() 
							{
							})
						.prev('a')
							.button( {
								text: false,
								icons: {
									primary: "ui-icon-gear"
								}
							})
							.click(function() {
								Cmenu.fn.newwinOpen(this);
							})
						.prev('a')
							.button( {
								text: false,
								icons: {
									primary: "ui-icon-wrench"
								}
							})
							.click(function() {
								Cmenu.fn.editButtonHandle(this);
							})
						.parent()
							.buttonset();
				return this;
			},
	newwinOpen:function(elem)
			{
				elem = $_(elem).nextAll('a:last');
				return this;
			},
	allButtonUnbind:function(elemsindex)
			{
				$_('#addnewsvm').unbind('click');
				$_('#menulist .rasta-buttonset')
						.each(function()
						{
							for(i=0; i<elemsindex.length; i++)
							{
								$_(this).contents('a').eq(elemsindex[i])
											.unbind('click');
							}
						});
				return this;
			},
	setSaveButton:function(elem)
			{
				var options = {
						label: lang.ab,
						icons: {
							primary: "ui-icon-disk"
								}
						};
				$_(elem).button( "option", options ); 
				return this;
			},
	saveButtonBind:function(elem)
			{
				$_(elem)
					.click(function()
					{
						Cmenu.fn.editButtonHandle(this);
					});
				return this;
			},
	setCancelButton:function(elem)
			{
				var options = {
						label: lang.o,
						icons: {
							primary: "ui-icon-close"
								}
						};
				$_(elem).next()
					.button( "option", options )
				return this;
			},
	cancelButtonBind:function(elem)
			{
				$_(elem).next()
					.click(function()
						{
								Cmenu.fn.refreshButtonSetting()
										.refreshButtonBind();
								$_(this).nextAll('a:last').find('.ui-button-text')
									.html(Cmenu.fn.buffer);
								Cmenu.fn.prepareMenu('cancel');
						});
				return this;
			},
	deleteButtonBind:function(elem)
			{
				$_(elem).next()
					.click(function()
						{
								
								$_(this).parent().remove();
						});
				return this;
			},
	refreshButtonSetting:function()
			{
				$_('#menulist .menutitle')
					.each(function()
					{
						$_(this).prevAll('a:last')
							.button("option", {
								label: lang.v,
								icons: {
									primary: "ui-icon-wrench"
								}
							})
						.next('a')
							.button("option", {
								label: lang.d,
								icons: {
									primary: "ui-icon-gear"
								}
							});
					});
				return this;
			},
	refreshButtonBind:function()
			{
				this.allButtonUnbind([0,1,2,3]).setListTools();
				$_('#menulist .menutitle')
					.each(function()
					{
						$_(this)
						.prev('a')
							.click(function() {
							})
						.prev('a')
							.click(function() {
								Cmenu.fn.editButtonHandle(this);
							})
						.prev('a')
							.click(function() {alert('');
							});
					});
			},
			
	editButtonHandle:function(elem)
			{
					var options;
					var thismenu = $_(elem).nextAll('a:last');
					if ( $_(elem).find('.ui-icon-wrench').length ) 
					{
						this.allButtonUnbind([0,1])
							.setSaveButton(elem)
							.saveButtonBind(elem)
							.setCancelButton(elem)
							.cancelButtonBind(elem);
						this.buffer = thismenu.text();
						thismenu.find('.ui-button-text').html('<input type="text" value="'+this.buffer+'" />');
						id		= thismenu.attr('menuid');
						page_id	= config.site.pageId
						Cmenu.fn.prepareMenu('edit',id,page_id);
					}
					else if($_(elem).find('.ui-icon-disk').length)
					{
						if ($_('#menulist .rasta-buttonset').find('input').val()!='')
						{
							this.refreshButtonSetting()
								.refreshButtonBind();
								$_('#menulist .rasta-buttonset:first').find('.ui-state-focus').removeClass('ui-state-focus');
							title 	= thismenu.find('.ui-button-text input').val()
							menuid=	thismenu.attr('menuid')
							if(! menuid)
							{
								Cmenu.fn.saveMenu(title);
							}
							else
							{
								Cmenu.fn.replaceMenu(title,menuid);
							}
							Cmenu.fn.prepareMenu('save');
						}
						else
						{
							$var.alert('عنوان منو نمی تواند خالی باشد');
						}
					}
					
			},
	saveMenu:function(title)
			{
				$_('ul.createmenu').find('li.sampleLi').remove();
				$_('ul.createmenu').find('*').removeAttr('class').removeAttr('style').removeAttr('sizset').removeAttr('sizcache');
				menucontent	=	$_('ul.createmenu').html();
				$_.ajax
					({
						url			: '/admin/ajaxset/savemenu',
						type		: 'post',
						dataType	: 'json',
						data		: {'menucontent':menucontent.toLowerCase(),'title':title},
						success		: function(msg){ $var.paging.refresh('menu',1); $var.alert(msg[1]);} 
					
					});
			},
	replaceMenu:function(title,menuid)
			{
				$_('ul.createmenu').find('li.sampleLi').remove();	
				$_('ul.createmenu').find('*').removeAttr('class').removeAttr('style').removeAttr('sizset').removeAttr('sizcache');
				$var.editedMenu = menuid;
				menucontent	=	$_('ul.createmenu').html();
				$_.ajax
					({
						url			: '/admin/ajaxset/replacemenu',
						type		: 'post',
						dataType	: 'json',
						data		: {'menucontent':menucontent.toLowerCase(),'title':title,'menuid':menuid},
						success		: function(msg){$var.paging.refresh('menu',1); Cbreedable.fn.refreshPageContent({type:'menu', unic:$var.editedMenu}); $var.alert(msg[1]);} 
					
					});
			}
};
