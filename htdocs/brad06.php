 <?php
 include 'array2xml.php';
 //header('Content-Type: text/xml; charset="UTF-8"');
 $input = array('product' => array(
       '@id' => 7,
       'name' => 'some string',
       'seo' => 'some-string',
       'ean' => '',
       'producer' => array(
           'name' => null,
           'photo' => '1.png'
       ),
       'stock' => 123,
       'trackstock' => 0,
       'new' => 0,
       'pricewithoutvat' => 1111,
       'price' => 1366.53,
       'discountpricenetto' => null,
       'discountprice' => null,
       'vatvalue' => 23,
       'currencysymbol' => 'PLN',
       '#description' => '',
       '#longdescription' => '',
       '#shortdescription' => '',
       'category' => array(
           'photo' => '1.png',
           'name' => 'test3',
       ),
       'staticattributes' => array(
           'attributegroup' => array(
               1 => array(
                   '@name' => 'attributes group',
                   'attribute' => array(
                       0 => array(
                           'name' => 'second',
                           'description' => 'desc2',
                           'file' => '',
                       ),
                       1 =>
                         array(
                           'name' => 'third',
                           'description' => 'desc3',
                           'file' => '',
                       ),
                   )
               )
           )
       ),
       'attributes' => array(),
       'photos' => array(
           'photo' => array(
               0 => array(
                   '@mainphoto' => '1',
                   '%' => '1.png',
               ),
               1 => array(
                   '@mainphoto' => '0',
                   '%' => '2.png',
               ),
               2 => array(
                   '@mainphoto' => '0',
                   '%' => '3.png',
               )
           )
       )
 ));
$input = array('name'=>'Brad', 'gender'=>true, 'age'=>51);
$xml = new ArrayToXML();
print $xml->buildXML($input);
?>
