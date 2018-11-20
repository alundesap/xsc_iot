
// Following logic from Thomas Jung
// http://scn.sap.com/thread/3447784

/**
@function Escape Special Characters in JSON strings
@param {string} input - Input String
@returns {string} the same string as the input but now escaped
*/
function escapeSpecialChars(input) {
          if(typeof(input) != 'undefined' && input != null)
          {
          return input
    .replace(/[\\]/g, '\\\\')
    .replace(/[\"]/g, '\\\"')
    .replace(/[\/]/g, '\\/')
    .replace(/[\b]/g, '\\b')
    .replace(/[\f]/g, '\\f')
    .replace(/[\n]/g, '\\n')
    .replace(/[\r]/g, '\\r')
    .replace(/[\t]/g, '\\t'); }
          else{
 
                    return "";
          }
}


/**
@function Converts any XSJS RecordSet object to a JSON Object
@param {object} rs - XSJS Record Set object
@param {optional String} rsName - name of the record set object in the JSON
@returns {object} JSON representation of the record set data
*/
function recordSetToJSON(rs,rsName){
          rsName = typeof rsName !== 'undefined' ? rsName : 'entries';
 
          var meta = rs.getMetaData();
          var colCount = meta.getColumnCount();
          var values=[];
          var table=[];
          var value="";
          while (rs.next()) {
          for (var i=1; i<=colCount; i++) {
                    value = '"'+meta.getColumnLabel(i)+'" : ';
               switch(meta.getColumnType(i)) {
               case $.db.types.VARCHAR:
               case $.db.types.CHAR:
                    value += '"'+ escapeSpecialChars(rs.getString(i))+'"';
                    break;
               case $.db.types.NVARCHAR:
               case $.db.types.NCHAR:
               case $.db.types.SHORTTEXT:
                    value += '"'+escapeSpecialChars(rs.getNString(i))+'"';
                    break;
               case $.db.types.TINYINT:
               case $.db.types.SMALLINT:
               case $.db.types.INT:
               case $.db.types.BIGINT:
                    value += rs.getInteger(i);
                    break;
               case $.db.types.DOUBLE:
                    value += rs.getDouble(i);
                    break;
               case $.db.types.DECIMAL:
                    value += rs.getDecimal(i);
                    break;
               case $.db.types.REAL:
                    value += rs.getReal(i);
                    break;
               case $.db.types.NCLOB:
               case $.db.types.TEXT:
                    value += '"'+ escapeSpecialChars(rs.getNClob(i))+'"';
                    break;
               case $.db.types.CLOB:
                    value += '"'+ escapeSpecialChars(rs.getClob(i))+'"';
                    break;                   
               case $.db.types.BLOB:
                          value += '"'+ $.util.convert.encodeBase64(rs.getBlob(i))+'"';
                    break;                   
               case $.db.types.DATE:
                    value += '"'+rs.getDate(i)+'"';
                    break;
               case $.db.types.TIME:
                    value += '"'+rs.getTime(i)+'"';
                    break;
               case $.db.types.TIMESTAMP:
                    value += '"' + (rs.getTimestamp(i)).getTime() + '"';
                    break;
               case $.db.types.SECONDDATE:
                    value += '"'+rs.getSeconddate(i)+'"';
                    break;
               default:
                    value += '"'+escapeSpecialChars(rs.getString(i))+'"';
               }
               values.push(value);
               }
             table.push('{'+values+'}');
          }
          return           JSON.parse('{"'+ rsName +'" : [' + table          +']}');
 
}