@echo off
echo Comenzará La Descarga de los Registros de la Tabla VW_COPLADII_CENAPI Desde el Servidor de PFM
BCP [dbo].[VW_COPLADII_CENAPI] out \\192.168.206.113\SqlBulkCopy\VW_COPLADII_CENAPI_Queryout.csv -d SIER -U CARLTOMARO -P TON4MARO$23. -S 164.56.1.60 -c -C 65001 -a 65536 -b 20000 -t^#^|
exit