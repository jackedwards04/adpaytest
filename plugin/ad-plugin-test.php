
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
function adpay_register_settings() {
   add_option( 'adpay_option_name', '');
   register_setting( 'adpay_options_group', 'adpay_option_name', 'adpay_callback' );
}
add_action( 'admin_init', 'adpay_register_settings' );
function adpay_register_options_page() {
   add_options_page('Page Title', 'AdPay Menu', 'manage_options', 'adpay', 'adpay_options_page');
}
add_action('admin_menu', 'adpay_register_options_page');
function adpay_option_page()
{
  //content on page goes here
}

function adpay_options_page()
{
?>
  <div>
  <?php screen_icon(); ?>
  <h2>AdPay Settings</h2>
  <form method="post" action="options.php">
  <?php settings_fields( 'adpay_options_group' ); ?>
  <h3>Enter your public address</h3>
  <table>
  <tr valign="top">
  <th scope="row"><label for="adpay_option_name">Public Stellar Address</label></th>
  <td><input type="text" id="adpay_option_name" name="adpay_option_name" value="<?php echo get_option('adpay_option_name'); ?>" /></td>
  </tr>
  </table>
  <?php  submit_button(); ?>
  </form>
  </div>
<?php
}
function load_modal () {
    if( is_single() ) {
        $html = file_get_contents('C:\Program Files\xampp\htdocs\mytest\wp-content\plugins\ad-plugin-test\modal_main.html');
        echo $html;
    }
}
add_action( 'wp_body_open', 'load_modal' );