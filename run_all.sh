#!/bin/bash

# --- CONFIGURACIÓN ---
FECHA=$(date "+%Y-%m-%d %H:%M:%S")
LOG_FILE="/root/mi-bot/ejecucion_global.log"
USER_ID="U04AFLCNQ80"
API_URL="https://slack.com/api/chat.postMessage"

cd /root/mi-bot

# Función para enviar a Slack
send_to_slack() {
    local mensaje=$1
    jq -n --arg ch "$USER_ID" --arg txt "$mensaje" '{channel: $ch, text: $txt}' > /tmp/slack_payload.json
    curl -s -X POST -H 'Content-type: application/json; charset=utf-8' \
    -H "Authorization: Bearer $SLACK_TOKEN" \
    --data @/tmp/slack_payload.json "$API_URL" > /dev/null
    rm -f /tmp/slack_payload.json
}

# 1. INICIO GLOBAL
send_to_slack "🚀 *Iniciando Batería de Tests Progresiva*\n_Se reportará cada proyecto individualmente._"
echo "--- INICIO EJECUCIÓN $FECHA ---" > $LOG_FILE

# 2. LISTA DE PROYECTOS
PROYECTOS=("zubi" "zubicapital" "matteco" "zubicities" "fundacionfelisa" "woodea" "zubilabs")

for PROYECTO in "${PROYECTOS[@]}"
do
    echo "[$PROYECTO] Ejecutando..." >> $LOG_FILE
    
    # EJECUCIÓN: Hemos quitado '--no-colors' para evitar el error
    if npx playwright test --project="$PROYECTO" > /tmp/last_test.log 2>&1; then
        # ✅ ÉXITO
        send_to_slack "🟢 *Proy: $PROYECTO* -> Todo OK."
        echo "[$PROYECTO] ✅ PASÓ" >> $LOG_FILE
    else
        # ❌ ERROR
        # Limpiamos códigos de colores si los hubiera y extraemos el error
        ERROR_STR=$(grep "Error:" /tmp/last_test.log | head -n 3 | sed 's/\x1b\[[0-9;]*m//g')
        [ -z "$ERROR_STR" ] && ERROR_STR="Fallo en los tests de $PROYECTO. Revisa logs."
        
        send_to_slack "🔴 *Proy: $PROYECTO* -> FALLÓ.\n\`\`\`$ERROR_STR\`\`\`"
        echo "[$PROYECTO] ❌ FALLÓ" >> $LOG_FILE
        cat /tmp/last_test.log >> $LOG_FILE
    fi
done

# 3. FIN GLOBAL
send_to_slack "🏁 *Batería completa finalizada*."