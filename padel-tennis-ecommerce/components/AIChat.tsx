"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, X, Bot, User, Sparkles, Star } from "lucide-react";
import { type Product } from "@/lib/products";
import { getProducts } from "@/lib/products";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  products?: Product[];
  timestamp: Date;
}

const formatPrice = (price: number): string => {
  return `$${price.toLocaleString("es-AR", { minimumFractionDigits: 0 })}`;
};

const subcategoryNames: { [key: string]: string } = {
  // Padel
  palas: "Palas",
  zapatillas: "Zapatillas",
  pelotas: "Pelotas",
  bolsos: "Bolsos",
  ropa: "Ropa",
  accesorios: "Accesorios",
  // Tenis de Mesa
  gomas: "Gomas",
  mesas: "Mesas",
};

const categoryNames: { [key: string]: string } = {
  padel: "Padel",
  "tenis-mesa": "Tenis de Mesa",
};

const brandNames: { [key: string]: string } = {
  babolat: "Babolat",
  head: "Head",
  wilson: "Wilson",
  adidas: "Adidas",
  bullpadel: "Bullpadel",
  dunlop: "Dunlop",
  butterfly: "Butterfly",
  dhs: "DHS",
};

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "¡Hola! Soy tu asistente de FullSpin. Puedo ayudarte a encontrar el producto perfecto. ¿Qué estás buscando?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Sistema local de análisis y recomendación
  const analyzeQuery = (query: string): {
    category?: string;
    subcategory?: string;
    priceRange?: { min: number; max: number };
    keywords: string[];
    budget?: number;
    brand?: string;
    skillLevel?: string;
  } => {
    const lowerQuery = query.toLowerCase();
    const keywords = lowerQuery.split(" ").filter(word => word.length > 2);
    
    let category: string | undefined;
    let subcategory: string | undefined;
    let priceRange: { min: number; max: number } | undefined;
    let budget: number | undefined;
    let brand: string | undefined;
    let skillLevel: string | undefined;

    // Detectar categoría
    if (lowerQuery.includes("padel") || lowerQuery.includes("pádel")) {
      category = "padel";
    } else if (lowerQuery.includes("tenis") && lowerQuery.includes("mesa")) {
      category = "tenis-mesa";
    }

    // Detectar subcategoría
    const subcategoryKeywords = {
      palas: ["pala", "paleta", "raqueta"],
      zapatillas: ["zapatilla", "zapato", "calzado", "tenis"],
      pelotas: ["pelota", "bola"],
      bolsos: ["bolso", "mochila", "bag"],
      ropa: ["ropa", "camiseta", "pantalón", "remera"],
      accesorios: ["accesorio", "grip", "overgrip", "protector"],
      gomas: ["goma", "caucho", "rubber"],
      mesas: ["mesa", "tabla"],
    };

    for (const [sub, keywords] of Object.entries(subcategoryKeywords)) {
      if (keywords.some(keyword => lowerQuery.includes(keyword))) {
        subcategory = sub;
        break;
      }
    }

    // Detectar marca
    for (const [brandKey, brandName] of Object.entries(brandNames)) {
      if (lowerQuery.includes(brandKey.toLowerCase()) || lowerQuery.includes(brandName.toLowerCase())) {
        brand = brandKey;
        break;
      }
    }

    // Detectar nivel
    if (lowerQuery.includes("principiante") || lowerQuery.includes("iniciante")) {
      skillLevel = "beginner";
    } else if (lowerQuery.includes("intermedio") || lowerQuery.includes("medio")) {
      skillLevel = "intermediate";
    } else if (lowerQuery.includes("avanzado") || lowerQuery.includes("experto") || lowerQuery.includes("profesional")) {
      skillLevel = "advanced";
    }

    // Detectar rango de precio
    const priceMatch = lowerQuery.match(/(\d+)\s*(?:mil|k|000)/i);
    if (priceMatch) {
      const amount = parseInt(priceMatch[1]);
      if (lowerQuery.includes("hasta") || lowerQuery.includes("máximo")) {
        priceRange = { min: 0, max: amount * 1000 };
        budget = amount * 1000;
      } else if (lowerQuery.includes("entre") || lowerQuery.includes("rango")) {
        priceRange = { min: amount * 1000, max: amount * 2000 };
      }
    }

    return { category, subcategory, priceRange, keywords, budget, brand, skillLevel };
  };

  const findRelevantProducts = (analysis: ReturnType<typeof analyzeQuery>): Product[] => {
    let filtered = [...products];

    // Filtrar por categoría
    if (analysis.category) {
      filtered = filtered.filter(product => product.category === analysis.category);
    }

    // Filtrar por subcategoría
    if (analysis.subcategory) {
      filtered = filtered.filter(product => product.subcategory === analysis.subcategory);
    }

    // Filtrar por marca
    if (analysis.brand) {
      filtered = filtered.filter(product => 
        typeof product.marca === 'string' &&
        product.marca.toLowerCase() === analysis.brand!.toLowerCase()
      );
    }

    // Filtrar por rango de precio
    if (analysis.priceRange) {
      filtered = filtered.filter(product => 
        product.price >= analysis.priceRange!.min && 
        product.price <= analysis.priceRange!.max
      );
    }

    // Filtrar por presupuesto
    if (analysis.budget) {
      filtered = filtered.filter(product => product.price <= analysis.budget!);
    }

    // Si no hay filtros específicos, usar coincidencia de palabras clave
    if (filtered.length === 0 || (!analysis.category && !analysis.subcategory && !analysis.priceRange && !analysis.brand)) {
      filtered = products.filter(product => {
        const productText = `${product.name} ${product.description} ${product.marca} ${product.category} ${product.subcategory}`.toLowerCase();
        return analysis.keywords.some(keyword => productText.includes(keyword));
      });
    }

    // Ordenar por relevancia
    filtered.sort((a, b) => {
      if (analysis.budget) {
        return a.price - b.price;
      }
      if (analysis.skillLevel) {
        if (analysis.skillLevel === "beginner") {
          return a.price - b.price;
        } else if (analysis.skillLevel === "advanced") {
          return b.price - a.price;
        }
      }
      return a.name.localeCompare(b.name);
    });

    return filtered.slice(0, 6); // Máximo 6 productos
  };

  const generateResponse = (query: string, relevantProducts: Product[]): string => {
    const analysis = analyzeQuery(query);
    let response = "";

    if (relevantProducts.length === 0) {
      response = "No encontré productos que coincidan exactamente con tu búsqueda. ¿Podrías ser más específico? Por ejemplo, puedes mencionar la categoría (padel o tenis de mesa), el tipo de producto, marca, o tu presupuesto.";
    } else {
      const categoryText = analysis.category ? ` de ${categoryNames[analysis.category]}` : "";
      const subcategoryText = analysis.subcategory ? ` ${subcategoryNames[analysis.subcategory]}` : "";
      const brandText = analysis.brand ? ` de ${brandNames[analysis.brand]}` : "";
      const budgetText = analysis.budget ? ` hasta $${analysis.budget.toLocaleString("es-AR")}` : "";
      const skillText = analysis.skillLevel ? ` para nivel ${analysis.skillLevel}` : "";
      
      response = `Encontré ${relevantProducts.length} producto${relevantProducts.length > 1 ? 's' : ''}${categoryText}${subcategoryText}${brandText}${budgetText}${skillText} que podrían interesarte:`;
    }

    return response;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Procesar con el sistema local
    await new Promise(resolve => setTimeout(resolve, 600)); // Simula "pensando"
    const analysis = analyzeQuery(userMessage.content);
    const relevantProducts = findRelevantProducts(analysis);
    const aiResponse = generateResponse(userMessage.content, relevantProducts);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "ai",
      content: aiResponse,
      products: relevantProducts.length > 0 ? relevantProducts : undefined,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleWhatsAppClick = (product: Product) => {
    const message = `Hola! Me interesa el producto: ${product.name}. ¿Está disponible?`;
    const whatsappUrl = `https://wa.me/543705103672?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-end p-4 z-50">
          <Card className="w-full max-w-md h-[600px] flex flex-col bg-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <h3 className="font-semibold">Asistente FullSpin</h3>
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.type === "ai" && (
                        <Bot className="w-4 h-4 mt-0.5 text-purple-600" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        
                        {/* Product Recommendations */}
                        {message.products && message.products.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {message.products.map((product) => (
                              <Card key={product.id} className="w-full max-w-[320px] box-border border border-gray-200 hover:shadow-md transition-shadow overflow-x-hidden mx-auto">
                                <CardContent className="p-3 w-full flex items-center gap-3 box-border overflow-x-hidden">
                                  <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                    <img
                                      src={product.image || "/placeholder.svg"}
                                      alt={product.name}
                                      className="w-full h-full object-contain rounded-lg max-w-[64px] max-h-[64px]"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm text-gray-900 truncate break-words max-w-full">
                                      {product.name}
                                    </h4>
                                    <p className="text-xs text-gray-600 mb-1 truncate max-w-full">
                                      {product.marca} • {subcategoryNames[product.subcategory]}
                                    </p>
                                    <p className="font-bold text-purple-600 text-sm">
                                      {formatPrice(product.price)}
                                    </p>
                                    <Button
                                      size="sm"
                                      className="mt-1 w-full max-w-full bg-green-600 hover:bg-green-700 text-white text-xs"
                                      style={{minWidth:0, maxWidth:'100%'}}
                                      onClick={() => handleWhatsAppClick(product)}
                                    >
                                      <MessageCircle className="w-3 h-3 mr-1" />
                                      Consultar
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-purple-600" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe lo que buscas..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Ejemplos: "Busco una pala de padel", "Tenis de mesa hasta $50.000", "Zapatillas Babolat para principiantes"
              </p>
            </div>
          </Card>
        </div>
      )}
    </>
  );
} 