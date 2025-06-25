import 'package:flutter/material.dart';
import 'package:openapi/api.dart';

void main() => runApp(const StockMarketApp());

class StockMarketApp extends StatelessWidget {
  const StockMarketApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(useMaterial3: true),
      home: const MainNavigation(),
      routes: {
        '/stock-detail': (context) => const StockDetailPage(),
        '/pro-version': (context) => const ProVersionPage(),
      },
    );
  }
}

class MainNavigation extends StatefulWidget {
  const MainNavigation({super.key});

  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> {
  int currentPageIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Stock Market Tracker'),
        actions: [
          IconButton(
            icon: const Icon(Icons.account_circle),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const AuthPage()),
              );
            },
          ),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        onDestinationSelected: (int index) {
          setState(() {
            currentPageIndex = index;
          });
        },
        selectedIndex: currentPageIndex,
        destinations: const <Widget>[
          NavigationDestination(
            selectedIcon: Icon(Icons.home),
            icon: Icon(Icons.home_outlined),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.bar_chart),
            label: 'Market',
          ),
          NavigationDestination(
            icon: Icon(Icons.newspaper),
            label: 'News',
          ),
          NavigationDestination(
            icon: Icon(Icons.wallet),
            label: 'Portfolio',
          ),
        ],
      ),
      body: <Widget>[
        // 1. Main Page
        const HomePage(),

        // 2. Market Page (Stock prices + news snapshot)
        MarketPage(),

        // 3. News Page
        NewsPage(),

        // 4. Portfolio Page
        PortfolioPage(),
      ][currentPageIndex],
    );
  }
}

// 1. Main Page Widget
class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        children: [
          // Market summary section
          const Padding(
            padding: EdgeInsets.all(16.0),
            child: Text(
              'Market Overview',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
          ),
          // TODO: Add API call to get market summary
          // Example: final marketData = await StockApi.getMarketSummary();

          // Top movers section
          const Padding(
            padding: EdgeInsets.all(16.0),
            child: Text(
              'Top Movers',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
          ),
          SizedBox(
            height: 120,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: 5, // TODO: Replace with actual data length
              itemBuilder: (context, index) {
                return GestureDetector(
                  onTap: () {
                    Navigator.pushNamed(context, '/stock-detail');
                  },
                  child: Card(
                    margin: const EdgeInsets.all(8),
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        children: [
                          Text('STOCK${index + 1}'),
                          const SizedBox(height: 8),
                          Text('\$${(100 + index * 10).toStringAsFixed(2)}'),
                          const SizedBox(height: 8),
                          Text(
                            '${index % 2 == 0 ? '+' : '-'}${index + 1}%',
                            style: TextStyle(
                              color: index % 2 == 0 ? Colors.green : Colors.red,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),

          // News highlights
          const Padding(
            padding: EdgeInsets.all(16.0),
            child: Text(
              'Latest News',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
          ),
          // TODO: Add API call to get news highlights
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: 3, // TODO: Replace with actual news items
            itemBuilder: (context, index) {
              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: ListTile(
                  title: Text('Important Market News ${index + 1}'),
                  subtitle: Text('Brief description of news item ${index + 1}'),
                  trailing: const Icon(Icons.arrow_forward),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}

// 2. Market Page Widget
class MarketPage extends StatelessWidget {
  MarketPage({super.key});

  final List<String> stockSymbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: stockSymbols.length,
      itemBuilder: (context, index) {
        return Card(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: ListTile(
            title: Text(stockSymbols[index]),
            subtitle:
                const Text('\$150.25 (+1.5%)'), // TODO: Replace with real data
            trailing: const Icon(Icons.arrow_forward),
            onTap: () {
              Navigator.pushNamed(
                context,
                '/stock-detail',
                arguments: stockSymbols[index],
              );
            },
          ),
        );
      },
    );
  }
}

// 3. News Page Widget
class NewsPage extends StatelessWidget {
  NewsPage({super.key});

  final List<Map<String, String>> newsItems = [
    {
      'title': 'Market Rally Continues',
      'summary': 'Stocks rise for third consecutive day',
      'time': '2 hours ago'
    },
    {
      'title': 'Tech Stocks Lead Gains',
      'summary': 'Major tech companies report strong earnings',
      'time': '5 hours ago'
    },
    // TODO: Add more news items from API
  ];

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: newsItems.length,
      itemBuilder: (context, index) {
        return Card(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: ListTile(
            title: Text(newsItems[index]['title']!),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(newsItems[index]['summary']!),
                const SizedBox(height: 4),
                Text(
                  newsItems[index]['time']!,
                  style: const TextStyle(color: Colors.grey, fontSize: 12),
                ),
              ],
            ),
            trailing: const Icon(Icons.arrow_forward),
          ),
        );
      },
    );
  }
}

// 4. Portfolio Page Widget
class PortfolioPage extends StatelessWidget {
  PortfolioPage({super.key});

  final List<Map<String, dynamic>> portfolioItems = [
    {'symbol': 'AAPL', 'shares': 10, 'price': 150.25, 'change': 1.5},
    {'symbol': 'GOOGL', 'shares': 5, 'price': 2750.50, 'change': -0.8},
    // TODO: Replace with user's actual portfolio data
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const Padding(
          padding: EdgeInsets.all(16.0),
          child: Text(
            'Your Portfolio',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
        ),
        Expanded(
          child: ListView.builder(
            itemCount: portfolioItems.length,
            itemBuilder: (context, index) {
              final item = portfolioItems[index];
              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: ListTile(
                  title: Text(item['symbol']),
                  subtitle: Text('${item['shares']} shares'),
                  trailing: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text('\$${(item['price'] as double).toStringAsFixed(2)}'),
                      Text(
                        '${item['change'] > 0 ? '+' : ''}${item['change']}%',
                        style: TextStyle(
                          color: item['change'] > 0 ? Colors.green : Colors.red,
                        ),
                      ),
                    ],
                  ),
                  onTap: () {
                    Navigator.pushNamed(
                      context,
                      '/stock-detail',
                      arguments: item['symbol'],
                    );
                  },
                ),
              );
            },
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: ElevatedButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const ProVersionPage()),
              );
            },
            child: const Text('Upgrade to Pro'),
          ),
        ),
      ],
    );
  }
}

// 5. Stock Detail Page Widget
class StockDetailPage extends StatelessWidget {
  const StockDetailPage({super.key});

  @override
  Widget build(BuildContext context) {
    final symbol =
        ModalRoute.of(context)?.settings.arguments as String? ?? 'STOCK';

    return Scaffold(
      appBar: AppBar(
        title: Text(symbol),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Stock price header
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  Text(
                    symbol,
                    style: const TextStyle(
                        fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    '\$150.25',
                    style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    '+1.5%',
                    style: TextStyle(fontSize: 18, color: Colors.green),
                  ),
                ],
              ),
            ),

            // Chart placeholder
            Container(
              height: 200,
              margin: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Center(
                child: Text('Stock Chart Placeholder'),
              ),
            ),

            // Key information
            const Padding(
              padding: EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Key Information',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 8),
                  // TODO: Replace with actual stock data
                  ListTile(
                    title: Text('Market Cap'),
                    trailing: Text('\$2.5T'),
                  ),
                  ListTile(
                    title: Text('P/E Ratio'),
                    trailing: Text('25.6'),
                  ),
                  ListTile(
                    title: Text('Dividend Yield'),
                    trailing: Text('0.5%'),
                  ),
                ],
              ),
            ),

            // Related news
            const Padding(
              padding: EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Related News',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 8),
                  Card(
                    child: ListTile(
                      title: Text('Company reports strong earnings'),
                      subtitle: Text('Published 3 hours ago'),
                    ),
                  ),
                  Card(
                    child: ListTile(
                      title: Text('Analysts raise price target'),
                      subtitle: Text('Published 1 day ago'),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// 6. Auth Page Widget (Registration/Sign-in)
class AuthPage extends StatelessWidget {
  const AuthPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Sign In / Register'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextFormField(
              decoration: const InputDecoration(
                labelText: 'Email',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            TextFormField(
              obscureText: true,
              decoration: const InputDecoration(
                labelText: 'Password',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {
                // TODO: Implement authentication logic
                // Example: await AuthApi.signIn(email, password);
                Navigator.pop(context);
              },
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(double.infinity, 50),
              ),
              child: const Text('Sign In'),
            ),
            const SizedBox(height: 16),
            TextButton(
              onPressed: () {
                // TODO: Implement registration flow
              },
              child: const Text('Create new account'),
            ),
          ],
        ),
      ),
    );
  }
}

// 7. Pro Version Page Widget
class ProVersionPage extends StatelessWidget {
  const ProVersionPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Upgrade to Pro'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Pro Features',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            const ListTile(
              leading: Icon(Icons.star),
              title: Text('Advanced Analytics'),
              subtitle: Text('Get in-depth stock analysis and insights'),
            ),
            const ListTile(
              leading: Icon(Icons.notifications_active),
              title: Text('Real-time Alerts'),
              subtitle: Text('Instant notifications for price movements'),
            ),
            const ListTile(
              leading: Icon(Icons.trending_up),
              title: Text('Premium Research'),
              subtitle: Text('Access to exclusive market research'),
            ),
            const Spacer(),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    const Text(
                      'Pro Version',
                      style:
                          TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      '\$9.99/month',
                      style: TextStyle(fontSize: 24),
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () {
                        // TODO: Implement purchase logic
                        // Example: await PaymentApi.purchaseProVersion();
                        Navigator.pop(context);
                      },
                      style: ElevatedButton.styleFrom(
                        minimumSize: const Size(double.infinity, 50),
                      ),
                      child: const Text('Subscribe Now'),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
