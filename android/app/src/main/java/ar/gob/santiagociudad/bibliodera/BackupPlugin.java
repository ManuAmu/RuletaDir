package ar.gob.santiagociudad.bibliodera;

import android.app.Activity;
import android.content.Intent;
import androidx.activity.result.ActivityResult;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

@CapacitorPlugin(name = "BiblioderaBackup")
public class BackupPlugin extends Plugin {
    @PluginMethod public void save(PluginCall call) {
        String json = call.getString("json");
        if (json == null || json.length() > 1000000) { call.reject("Copia inválida."); return; }
        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("application/json");
        intent.putExtra(Intent.EXTRA_TITLE, "bibliodera-preguntas.json");
        startActivityForResult(call, intent, "saved");
    }
    @ActivityCallback private void saved(PluginCall call, ActivityResult result) {
        if (call == null) return;
        if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null || result.getData().getData() == null) {
            call.reject("Exportación cancelada."); return;
        }
        try (OutputStream out = getContext().getContentResolver().openOutputStream(result.getData().getData(), "wt")) {
            if (out == null) throw new Exception("No se pudo abrir el archivo.");
            out.write(call.getString("json", "{}").getBytes(StandardCharsets.UTF_8));
            call.resolve();
        } catch (Exception e) { call.reject("No se pudo guardar la copia.", e); }
    }
}
