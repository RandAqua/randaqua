import { NextResponse } from 'next/server';

// API роут для анализа случайности файлов - проксирует запросы к backend
export async function POST(request) {
  try {
    // Получаем FormData из запроса клиента
    const formData = await request.formData();
    
    // Проксируем запрос на backend сервер анализа случайности
    const response = await fetch('http://26.237.158.25:8000/files/upload-txt-detailed', {
      method: 'POST',
      body: formData,
      // Не указываем mode: 'cors' для серверных запросов
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ошибка внешнего сервера:', response.status, errorText);
      
      return NextResponse.json(
        { 
          success: false, 
          error: `Ошибка сервера анализа: ${response.status}`,
          details: errorText 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Возвращаем результат анализа клиенту
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Ошибка прокси:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка подключения к серверу анализа',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Обработка CORS preflight запросов
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
