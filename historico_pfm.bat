@echo off
echo Obteniendo Datos Historicos Desde el Servidor de PFM
BCP [dbo].[BitacoraSIER] out \\192.168.206.113\SqlBulkCopy\Bitacora_BCP_Queryout.csv -d SIER -U CARLTOMARO -P TON4MARO$23. -S 164.56.1.60 -c -C 65001 -a 65536 -b 20000 -t^|^|
sqlcmd.exe -d SAM -U oortega -P 130192Ocielorte -S 192.168.206.113 -i "truncateBitacoraSIER_BCP.sql"
BCP [sam].[BitacoraSIER_BCP] in \\192.168.206.113\SqlBulkCopy\Bitacora_BCP_Queryout.csv -d SAM -U oortega -P 130192Ocielorte -S 192.168.206.113 -c -C 65001 -a 65536 -b 20000 -t^|^|
exit