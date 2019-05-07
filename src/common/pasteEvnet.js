export const imgReader = function( item, callback ){
	var blob = item.getAsFile(),
		reader = new FileReader();
	reader.onload = function( e ){
			// var img = new Image();
			// img.src = e.target.result;
			callback({src: e.target.result});
	};
	reader.readAsDataURL( blob );
};
const pasteEvnet = function ( e ) {
		var clipboardData = e.clipboardData,
				i = 0,
				items, item, types;
		        if (!clipboardData.items) { //chrome  
		            insertHtmlAtCaret(clipboardData.getData('text/plain'), true);
		            return false;
		        }  
			if( clipboardData ){
				items = clipboardData.items;
				if( !items ){
					return;
				}
				item = items[0];
				types = clipboardData.types || [];
				for( ; i < types.length; i++ ){
					if( types[i] === 'Files' ){
							item = items[i];
							break;
					}
				}
				if ( item && item.kind === 'string') {
					// $( '#pc_mes_input' ).append( clipboardData.getData('text/plain') );
					// inputSave += clipboardData.getData('text/plain');
					// $( '#pc_mes_input' ).on('input', function () {
					//   console.log($(this).html());
					// })
					return false;
				};
				if( item && item.kind === 'file' && item.type.match(/^image\//i) ){
					e.preventDefault();
					return  {value: item};
				}
			}
	} 


export default pasteEvnet;