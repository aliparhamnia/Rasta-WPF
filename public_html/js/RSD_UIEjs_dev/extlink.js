function CextLink()
{
	return CextLink.fn.init();
}
CextLink.fn=CextLink.prototype=
{
	buffer: {},

	init:function()
			{
				$_('#chk_seprator').live('click',function ()
					{
						if ($_('#chk_seprator').is(':checked'))
						{
							$_("#link_url").hide("fast");
						}
						else
						{
							$_("#link_url").show("fast");
						}
					});
				this.setLinkList().setListTools().setDialog();
				return this;
			},
	newBind:function()
			{
				CextLink.fn.openDialog(this,'new');
			},
	setListTools:function()
			{
				setListTools('#extlinklistpanel .listtools', this.newBind )
				return this;
			},
	setLinkList:function()
			{
				$_('#extlinklist .extlinktitle')
					.each(function()
					{
						CextLink.fn.setLinkButtonSet(this);
					})
				return this;
			},
	setLinkButtonSet:function(elem)
			{
						$_(elem)
							.button()
							.dblclick(function() 
							{
								$_(this).prevAll('a:last').click();
							})
						.prev('a')
							.button( {
								text: false,
								icons: {
									primary: "ui-icon-newwin"
								}
							})
							.click(function() {
										CextLink.fn.newwinOpenpage(this);
							})
						.prev('a')
							.button( {
								text: false,
								icons: {
									primary: "ui-icon-wrench"
								}
							})
							.click(function() {
								CextLink.fn.openDialog(this,'edit');
							})
						.parent()
							.buttonset();
				return this;
			},
	setDialog : function()
		{
			$_('<div dir="rtl" id="dlg_link"></div>')
									.dialog({ 
												width: 400,
												height: 200,
												autoOpen: false,
												resizable: false,
												buttons :	{
																"انصراف": function() {$_(this).dialog('close');},
																"تأیید": function(elem){
																						if ($_('#chk_seprator').is(':checked')) $_("#lnk_url").val('#');
																						if (($_("#lnk_title").val()!='')&&($_("#lnk_url").val()!=''))
																						{
																							if (CextLink.fn.buffer.state=='edit')	
																							{
																								extlinktitle	= $_("#lnk_title").val();
																								extlinkurl		= $_("#lnk_url").val();
																								extlinkid		= $_(this).attr('extlinkid');
																								CextLink.fn.replaceLink(extlinktitle,extlinkurl,extlinkid);
																								$_(this).dialog('close');
																							}
																							else if (CextLink.fn.buffer.state=='new')
																							{
																								CextLink.fn.saveLink($_("#lnk_title").val(),$_("#lnk_url").val());
																								$_(this).dialog('close');
																							}
																						}
																						else
																						{
																							$var.alert('عنوان لینک و آدرس لینک نمی توانند خالی باشند');
																						}
																						}
															}
												})
									.html(	'<div dir="rtl"><br />'
											+'عنوان لینک&nbsp;:&nbsp;&nbsp; '
											+'<input size="20px" id="lnk_title" type="text" value="" />&nbsp;&nbsp;<input type="checkbox" id="chk_seprator"/>به عنوان جدا کننده<br /><br />'
											+'<div id="link_url">'
											+'آدرس لینک&nbsp;&nbsp;:&nbsp;&nbsp;'
											+'<input size="20px" dir="ltr" id="lnk_url" type="text" value="" />'
											+'<span dir="ltr">http://www.&nbsp;&nbsp;</span></div>'
											+'</div>');
		},
	openDialog : function(elem,state)
		{
			this.buffer.elem	= elem;
			this.buffer.state	= state;
			if (state=='edit')
			{
				$_('#dlg_link').attr("extlinkid",$_(elem).nextAll('a:last').attr('extlinkid'));
				$_('#dlg_link')
						.find('#lnk_title').val($_(elem).nextAll('a:last').text());
				$_('#dlg_link')
					.find('#lnk_url').val($_(elem).next().attr('url'));
				if ($_(elem).next().attr('url')=='#')
				{
					$_('#chk_seprator').click().attr('checked',true);
					$_("#link_url").hide();
				}
				else
				{
					$_('#chk_seprator').click().attr('checked',false);
					$_("#link_url").show();
				}
				$_("#dlg_link").dialog({ title: 'ویرایش لینک' });
				$_('#dlg_link').dialog('open');
			}
			else if (state=='new')
			{
				$_('#chk_seprator').click().attr('checked',false);
				$_("#link_url").show();

				$_('#dlg_link')
						.find('#lnk_title').val('');
				$_('#dlg_link')
						.find('#lnk_url').val('');
				$_("#dlg_link").dialog({ title: 'ایجاد لینک' });
				$_('#dlg_link').dialog('open');
			}
			return this;
		},
	newwinOpenpage:function(elem)
		{
			extlinkurl	=	$_(elem).attr('url');
			if(extlinkurl=='#') return false;
			mywindow	=	window.open('http://'+extlinkurl); 
		},
	saveLink:function(extlinktitle,extlinkurl)
		{
			
			$_.ajax
				({
					url			: '/admin/ajaxset/savelink',
					type		: 'post',
					dataType	: 'json',
					data		: {'extlinktitle':extlinktitle,'extlinkurl':extlinkurl},
					success		: function(msg){$var.paging.refresh('extlink',1); $var.alert(msg[1]);} 
				});			
		},
	replaceLink:function(extlinktitle,extlinkurl,extlinkid)
		{
			$_.ajax
				({
					url			: '/admin/ajaxset/replacelink',
					type		: 'post',
					dataType	: 'json',
					data		: {'extlinktitle':extlinktitle,'extlinkurl':extlinkurl,'extlinkid':extlinkid},
					success		: function(msg){$var.paging.refresh('extlink',1); $var.alert(msg[1]);} 
				});
		}		
};