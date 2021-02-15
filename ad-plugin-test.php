
<?php
/**
* Plugin Name: Ad Pay Test
* Plugin URI: http://yourdomain.com
* Description: Insert a brief description of what your plugin does here.
* Version: 0.1.0
* Author: Your Name
* Author URI: http://yourdomain.com
* License: GPL2
*/


function load_modal () {
    if( is_single() ) {
        $html = file_get_contents('C:\Program Files\xampp\htdocs\mytest\wp-content\plugins\ad-plugin-test\modal_main.html');
        echo $html;
    }
}
add_action( 'wp_body_open', 'load_modal' );