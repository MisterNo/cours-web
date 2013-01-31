<?php
namespace coursWeb;

class Utils{

	public static function debug($var, $nom = '', $echo = true, $open = false){
		static $id = 0;
	
		if(DEBUG){
			$debug_id = date("His") . '_' . $id;
			ob_start();
			print_r($var);
			$cont = ob_get_contents();
			ob_end_clean();
			$tab_cont = explode("\n",$cont);
			$nb = sizeof($tab_cont);
			$block = 0;
			if($open)
			{
				$display = 'block';
				$button = '-';
			}
			else
			{
				$display = 'none';
				$button = '+';
			}
			foreach($tab_cont as $i => $ligne)
			{
				if($i < ($nb - 1) && trim($tab_cont[$i+1]) == '(')
				{
					$tab_cont[$i] = preg_replace('/ *\[(.*?)\] => (.*)/',
							'<span style="color:blue">$1</span> <span style="color:green">=></span> <span style="color:red;font-style:italic">$2</span>',$tab_cont[$i]);
					$tab_cont[$i] .= ' <span id="var'.$debug_id.'_b'.$block.'"
							onclick="b=document.getElementById(\'var'.$debug_id.'_block'.$block.'\').style;b.display=(b.display==\'none\'?\'block\':\'none\');" style="padding:0px 5px 0px 5px; height:20px; border: 1px solid black;font-weight:bold;background-color:palegoldenrod"
									>'.$button.'</span>
											<div id="var'.$debug_id.'_block'.$block.'" style="text-align:left;display:'.$display.'">';
				}
				elseif(trim($tab_cont[$i]) == ')')
				{
					$tab_cont[$i] = '</div>)</div>';
				}
				elseif(trim($tab_cont[$i]) == '(')
				{
					$tab_cont[$i] = '(<div style="padding-left:20px">';
				}
				else
				{
					$tab_cont[$i] = preg_replace('/ *\[(.*?)\] => (.*)/',
							'<span style="color:blue">$1</span> <span style="color:green">=></span> <span style="color:red;font-style:italic">$2</span>',$tab_cont[$i]);
					$tab_cont[$i] .= '<br />';
				}
				$block++;
			}
			ob_start();
	
			echo '<div class="debug" style="text-align:left;font-size:10pt">Variable '.$nom.' ('.gettype($var).')<br />Contenu : '.implode("\n",$tab_cont).'</div>';
			$result = ob_get_contents();
			ob_end_clean();
	
			$id++;
			if($echo){
				echo $result;
			}else{
				return $result;
			}
		}
	}
	
	public static function getData(){
		$s = AesCtr::decrypt($_REQUEST['d'], $_SESSION['key'], 256);
		$data = json_decode($s);
		$res = array();
		foreach($data as $i => $d){
			$res[$i] = $d;
		}
		return $res;
	}

	public static function sendData($data){
		echo AesCtr::encrypt($data, CRYPT_KEY, 256);
	}
}
