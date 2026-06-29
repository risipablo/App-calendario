const {createClient} = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

if(!supabaseUrl || !supabaseKey){
    console.error('Faltan variables de entorno para ejecutar la funcion')
    process.exit(1)
}

const supabase = createClient(supabaseUrl,supabaseKey)

async function KeepSupabase() {
    try{
        console.log(`${new Date().toISOString()} - Manteniendo activo supabase image`)

        const { error } = await supabase
        .from('storage.objects')
        .select('id', { count: 'exact', head: true })
        .limit(1);


        const {data:files, error: listError} = await supabase.storage
        .from('avatars')
        .list('',{limit:1000})

        if(listError){
            console.error('Error al listar archivos:', listError.message)
            return false
        }

        console.log(`Bucket accesible. Archivos: ${files?.length || 0}`)

        return true
    }
        catch (error) {
        console.error('Error en keepSupabase:', error.message);
        return false;
    }
}

module.exports = {KeepSupabase}
