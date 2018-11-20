$.import("iot.data","crudCommon");

/**
 * @param {connection} Connection - The SQL connection used in the OData request
 * @param {beforeTableName} String - The name of a temporary table with the single entyr before the operation  (UPDATE and DELETE events only)
 * @param {afterTableName} String - The name of a temporary table with thte single entry after the operation (CREATE and UPDATE events only)
**/


function tempCreate(param) {
    let after = param.afterTableName;
    
    //Get Input New Record Values
    var pStmt = param.connection.prepareStatement('select * from "' + after + '"');
    var Data = $.iot.data.crudCommon.recordSetToJSON(pStmt.executeQuery(), 'Details');
    pStmt.close();
   
// 01 "tempId" INTEGER CS_INT NOT NULL , 
// 02 "tempVal" INTEGER CS_INT NOT NULL , 
// 03 "ts" LONGDATE CS_LONGDATE NOT NULL , 
// 04 "created" LONGDATE CS_LONGDATE NOT NULL , 

    
    var field1 = parseInt(Data.Details[0].tempId);
    
    var field2 = parseInt(Data.Details[0].tempVal);

    var field3 = Data.Details[0].ts;
    var ts3,date3,tsmo3,tsda3,tshr3,tsmin3,tssec3,tsmils3;
    if (field3 !== "null") {
    	//var d = new Date("2015-03-25T12:00:00.123");
        date3 = new Date(parseInt(field3));  
        tsmo3 = date3.getMonth() + 1;
        if (tsmo3 <= 9) { tsmo3 = "0" + tsmo3; } else { tsmo3 = "" + tsmo3; }
        tsda3 = date3.getDate();
        if (tsda3 <= 9) { tsda3 = "0" + tsda3; } else { tsda3 = "" + tsda3; }
        
        tshr3 = date3.getHours();
        if (tshr3 <= 9) { tshr3 = "0" + tshr3; } else { tshr3 = "" + tshr3; }
        tsmin3 = date3.getMinutes();
        if (tsmin3 <= 9) { tsmin3 = "0" + tsmin3; } else { tsmin3 = "" + tsmin3; }
        tssec3 = date3.getSeconds();
        if (tssec3 <= 9) { tssec3 = "0" + tssec3; } else { tssec3 = "" + tssec3; }
        tsmils3 = date3.getMilliseconds();
        if (tsmils3 <= 9) { tsmils3 = "00" + tsmils3; } 
        else if ((9 < tsmils3) && (tsmils3 <= 99)) { tsmils3 = "0" + tsmils3; } 
        else { tsmils3 = "" + tsmils3; }
        
        ts3 = date3.getFullYear() + "-" + tsmo3 + "-" + tsda3 + " " + tshr3 + ":" + tsmin3 + ":" + tssec3 + "." + tsmils3;
    }
    else {
        ts3 = "null"; 
    }


    //Validate Parameters
    // if (!validateField4Empty(field4)) {
    //     throw 'Invalid direction for ' + field4 + '';
    // }

    //Get Next Sequence Number
    pStmt = param.connection.prepareStatement('select "IOT"."iot.data::tempId".NEXTVAL from dummy');
    var rs = pStmt.executeQuery();
    var seqNo = '';
    while (rs.next()) {
        seqNo = rs.getString(1);
    }
    pStmt.close();
    
    for (var i=0; i<2; i++) {
        //var pStmt;
        //insert into "IOT"."iot.data::sensors.temp" values("iot.data::tempId".NEXTVAL,100,TO_TIMESTAMP ('2016-02-02 13:23:45.678', 'YYYY-MM-DD HH24:MI:SS.FF3'),CURRENT_UTCTIMESTAMP);

        if (i<1) {
            pStmt = param.connection.prepareStatement('insert into "IOT"."iot.data::sensors.temp" values(?,?,TO_TIMESTAMP (?, \'YYYY-MM-DD HH24:MI:SS.FF3\'),CURRENT_UTCTIMESTAMP)');
        }
        else {
            pStmt = param.connection.prepareStatement('TRUNCATE TABLE "' + after + '" ');
            pStmt.executeUpdate();
            pStmt.close();
            
            pStmt = param.connection.prepareStatement('insert into "' + after + '" values(?,?,TO_TIMESTAMP (?, \'YYYY-MM-DD HH24:MI:SS.FF3\'),CURRENT_UTCTIMESTAMP)');
        }
        
        pStmt.setInteger(1, parseInt(seqNo));
        
        pStmt.setInteger(2, field2);

        if (ts3 === "null") { pStmt.setNull(3); } else { pStmt.setString(3, ts3); }
        
        pStmt.executeUpdate();
        pStmt.close();
    }
}

function validateField4Empty(the_field) {
    if (the_field === '') {
        return false;
    }
    else {
        return true;
    }
}


