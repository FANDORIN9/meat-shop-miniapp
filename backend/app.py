from flask import Flask, request, jsonify
from flask_cors import CORS  # Важно для CORS!
import requests
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Разрешаем запросы с любых доменов (для GitHub Pages)

# Конфигурация Telegram бота
TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_TOKEN')
TELEGRAM_CHAT_ID = os.getenv('CHAT_ID')
TELEGRAM_API_URL = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"

@app.route('/api/send-order', methods=['POST'])
def send_order_to_telegram():
    try:
        order_data = request.json
        
        # Формируем сообщение для Telegram
        message = format_order_message(order_data)
        
        # Отправляем сообщение в Telegram
        response = requests.post(TELEGRAM_API_URL, json={
            'chat_id': TELEGRAM_CHAT_ID,
            'text': message,
            'parse_mode': 'HTML'
        })
        
        if response.status_code == 200:
            return jsonify({
                'success': True, 
                'message': 'Заказ отправлен в Telegram'
            })
        else:
            return jsonify({
                'success': False, 
                'error': 'Ошибка отправки в Telegram'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False, 
            'error': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Для проверки работоспособности сервера"""
    return jsonify({'status': 'ok'})

def format_order_message(order):
    """Форматирование сообщения о заказе для Telegram"""
    
    # Список товаров
    products_text = ""
    for product in order['products']:
        products_text += f"  • {product['name']} - {product['quantity']} × {product['price']} ₽ = {product['price'] * product['quantity']} ₽\n"
    
    message = f"""
<b>📦 НОВЫЙ ЗАКАЗ #{order['id']}</b>

📅 <b>Дата:</b> {order['date']} {order['time']}
👤 <b>Клиент:</b> {order['customer']['name']}
📞 <b>Телефон:</b> {order['customer']['phone']}
📍 <b>Адрес:</b> {order['customer']['address']}
💬 <b>Комментарий:</b> {order['customer']['comment'] or 'Нет комментария'}

<b>🛒 Товары:</b>
{products_text}
━━━━━━━━━━━━━━━━━━
<b>Сумма товаров:</b> {order['subtotal']} ₽
<b>Доставка:</b> {order['delivery']} ₽
<b>ИТОГО К ОПЛАТЕ:</b> <u>{order['total']} ₽</u>

<b>Статус:</b> {order['status']}
"""
    return message

if __name__ == '__main__':
    app.run(debug=True, port=5000)