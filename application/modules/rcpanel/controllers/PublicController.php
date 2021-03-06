<?php
class Rcpanel_PublicController extends Zend_Controller_Action
{

	var 	$DB;

    public function init()
    {
		Rcpanel_Model_User_User::initUser();

    }
	public function generatecaptchaAction()
	{ 
		$this->_helper->layout()->disableLayout();
		$this->_helper->viewRenderer->setNoRender();
		$ses = new Zend_Session_Namespace('MyApp');
		 //Let's generate a totally random string using md5
		$md5_hash = md5(rand(0,999));
		//We don't need a 32 character long string so we trim it down to 5
		$security_code = substr($md5_hash, 15, 5);
		$ses->captchaCode = $security_code;
		//Set the image width and height
		$width = 120;
		$height = 30;
		//Create the image resource
		$image = ImageCreate($width, $height);
		//We are making three colors, white, black and gray
		$white = ImageColorAllocate($image, 255, 255, 255);
		$black = ImageColorAllocate($image, 0, 0, 0);
		$grey = ImageColorAllocate($image, 204, 204, 204);
		//Make the background black
		ImageFill($image, 0, 0, $black);
		//Add randomly generated string in white to the image
		ImageString($image, 3, 30, 3, $security_code, $white);
		//Throw in some lines to make it a little bit harder for any bots to break
		ImageRectangle($image,0,0,$width-1,$height-1,$grey);
		imageline($image, 0, $height/2, $width, $height/2, $grey);
		imageline($image, $width/2, 0, $width/2, $height, $grey);
		//Tell the browser what kind of file is come in
		header("Content-Type: image/jpeg");
		//Output the newly created image in jpeg format
		ImageJpeg($image);
	}
	public function watercapAction() 
	{
		$ses = new Zend_Session_Namespace('MyApp');
		//Let's generate a totally random string using md5
		$md5_hash = md5(rand(0,999));
		//We don't need a 32 character long string so we trim it down to 5
		$code = strtolower(substr($md5_hash, 15, 5));
		$ses->captchaCode = $code;
		//Set the image width and height
		$width = 120;
		$height = 30;
		//Create the image resource
		$image = ImageCreate($width, $height)or die('Cannot initialize new GD image stream');
		/* seed random number gen to produce the same noise pattern time after time */
		/* init image */
		$font_size = $height * 0.85;
		/* set the colours */
		$background_color = imagecolorallocate($image, 255, 255, 255);
		$text_color = imagecolorallocate($image, 20, 40, 100);
		$noise_color = imagecolorallocate($image, 100, 120, 180);
		/* create textbox and add text */
		$textbox = imagettfbbox($font_size, 0, 'impact', $code) or die('Error in imagettfbbox function');
		$x = ($width - $textbox[4])/2;
		$y = ($height - $textbox[5])/2;
		$d = -1;
		imagettftext($image, $font_size, 0, $x, $y, $text_color, 'impact' , $code) or die('Error in imagettftext function');
		imagettftext($image, $font_size, 0, $x + $d, $y + $d, $noise_color, 'impact' , $code) or die('Error in imagettftext function');
		imagettftext($image, $font_size, 0, $x + 2 * $d + 1, $y + 2 * $d + 1, $noise_color, 'impact' , $code) or die('Error in imagettftext function');
		imagettftext($image, $font_size, 0, $x + 2 * $d, $y + 2 * $d, $background_color, 'impact' , $code) or die('Error in imagettftext function');
		/* mix in background dots */
		for( $i=0; $i<($width*$height)/10; $i++ ) 
		{ 
			imagefilledellipse($image, mt_rand(0,$width), mt_rand(0,$height), 1, 1, $background_color);		 
		}
		/* mix in text and noise dots */
		for( $i=0; $i<($width*$height)/25; $i++ ) 
		{ 
			imagefilledellipse($image, mt_rand(0,$width), mt_rand(0,$height), 1, 1, $noise_color);		 
			imagefilledellipse($image, mt_rand(0,$width), mt_rand(0,$height), 1, 1, $text_color);		 
		}
		/* rotate a bit to add fuzziness */
		$image = imagerotate($image, 1, $background_color);
		//Tell the browser what kind of file is come in
		header("Content-Type: image/jpeg");
	//		header('Content-Type: text/plain; charset="UTF-8"');
		/* output */
		imagejpeg($image);
		imagedestroy($image);
	}
	public function ajaxvalidatorAction()
	{
		$this->_helper->layout()->disableLayout();
		$this->_helper->viewRenderer->setNoRender();
		$this->translate	= Zend_registry::get('translate');
		$domain		= $this->getRequest()->getParam('domain');
		$act		= $this->getRequest()->getParam('act');
		$validator	= new Application_Model_Validator;
		if ($act=='domain')
		{	
			$result	= $validator->checkdomain($domain);
		}
		else if ($act=='subdomain')
		{
			$result	= $validator->checksubdomain($domain);
		}
				if ($result==1)
	
		{
			echo $this->translate->_('a'); //'';
		}
		else
		{
			//print_r($result);
			foreach($result as $itm)
			{
				switch ($itm)
				{
					case -1:	echo $this->translate->_('b'); break;
					case -2:	echo $this->translate->_('c'); break;
					case -3:	echo $this->translate->_('d'); break;
					case -4:	echo $this->translate->_('e'); break;
					case -5:	echo $this->translate->_('f'); break;
				}
			}
		}
		
	}
	
    public function exportationAction()
    {
		//$this->_helper->viewRenderer->setNoRender();
		//$this->_helper->layout()->disableLayout();
		$ResNum			= stripslashes($this->getRequest()->getparam('ResNum'));
		$ses 			= new Zend_Session_Namespace('MyApp');

		if ($ResNum!=$ses->ResNum)
		{
			unset($ses->ResNum);
			$this->_helper->json->sendJson(array('result'=>'false'));
		}
		else
		{
			$this->DB	= Zend_Registry::get('front_db');
			$res			= $this->DB->fetchRow('select `amount` from `reservation_log` where `id`='.$ResNum .' and `host_id`='.$ses->id);
			$amountofResNum	= $res['amount'];
			$data 			= array('host_id'		=>$ses->id,
									'reservation_id'=>$ResNum,
									'amount'		=>$amountofResNum							
									);
			$this->DB->insert('pay_document',$data);
			unset($ses->ResNum);
			$this->_helper->json->sendJson(array('result'=>'true'));
		}
    }
	
}