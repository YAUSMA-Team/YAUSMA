import 'package:flutter/material.dart';
import 'package:openapi/api.dart';
import 'package:provider/provider.dart';

void main() => runApp(
      ChangeNotifierProvider(
        create: (context) => AppState(),
        child: const StockMarketApp(),
      ),
    );

class AppState extends ChangeNotifier {
  bool _isDarkMode = false;
  bool _isColorBlindMode = false;
  User? _currentUser;

  bool get isDarkMode => _isDarkMode;
  bool get isColorBlindMode => _isColorBlindMode;
  User? get currentUser => _currentUser;

  void toggleTheme() {
    _isDarkMode = !_isDarkMode;
    notifyListeners();
  }

  void toggleColorBlindMode() {
    _isColorBlindMode = !_isColorBlindMode;
    notifyListeners();
  }

  void login(User user) {
    _currentUser = user;
    notifyListeners();
  }

  void logout() {
    _currentUser = null;
    notifyListeners();
  }
}

class User {
  final String email;
  final String name;
  final List<Stock> portfolio;

  User(this.email, this.name, this.portfolio);
}

class Stock {
  final String symbol;
  final String name;
  final double currentPrice;
  final double change;

  Stock(this.symbol, this.name, this.currentPrice, this.change);
}

class StockMarketApp extends StatelessWidget {
  const StockMarketApp({super.key});

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppState>(context);

    return MaterialApp(
      theme: appState.isDarkMode
          ? _buildDarkTheme(appState.isColorBlindMode)
          : _buildLightTheme(appState.isColorBlindMode),
      home: const MainNavigation(),
      debugShowCheckedModeBanner: false,
    );
  }

  ThemeData _buildLightTheme(bool isColorBlind) {
    return ThemeData.light().copyWith(
      colorScheme: isColorBlind
          ? const ColorScheme.light(
              primary: Colors.blueGrey,
              secondary: Colors.amber,
            )
          : null,
    );
  }

  ThemeData _buildDarkTheme(bool isColorBlind) {
    return ThemeData.dark().copyWith(
      colorScheme: isColorBlind
          ? const ColorScheme.dark(
              primary: Colors.blueGrey,
              secondary: Colors.amber,
            )
          : null,
    );
  }
}

class MainNavigation extends StatefulWidget {
  const MainNavigation({super.key});

  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> {
  int _currentIndex = 0;
  final PageController _pageController = PageController();

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppState>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Stock Tracker'),
        actions: [
          IconButton(
            icon: const Icon(Icons.brightness_6),
            onPressed: () => appState.toggleTheme(),
          ),
          IconButton(
            icon: const Icon(Icons.accessibility_new),
            onPressed: () => appState.toggleColorBlindMode(),
          ),
          if (appState.currentUser != null) _buildUserMenu(context),
        ],
      ),
      body: PageView(
        controller: _pageController,
        onPageChanged: (index) => setState(() => _currentIndex = index),
        children: const [
          HomePage(),
          StocksOverviewPage(),
          NewsPage(),
          PortfolioPage(),
          ProVersionPage(),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) {
          setState(() => _currentIndex = index);
          _pageController.jumpToPage(index);
        },
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.trending_up), label: 'Stocks'),
          NavigationDestination(icon: Icon(Icons.article), label: 'News'),
          NavigationDestination(icon: Icon(Icons.wallet), label: 'Portfolio'),
          NavigationDestination(icon: Icon(Icons.star), label: 'Premium'),
        ],
      ),
    );
  }

  PopupMenuButton<String> _buildUserMenu(BuildContext context) {
    final appState = Provider.of<AppState>(context);

    return PopupMenuButton(
      itemBuilder: (context) => [
        PopupMenuItem(
          child: Text('Logged in as ${appState.currentUser!.email}'),
          enabled: false,
        ),
        const PopupMenuItem(
          value: 'logout',
          child: Text('Log out'),
        ),
      ],
      onSelected: (value) {
        if (value == 'logout') {
          appState.logout();
        }
      },
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        children: [
          const MarketSummaryCard(),
          const SizedBox(height: 16),
          const StockQuickView(),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const LoginPage()),
            ),
            child: const Text('Sign In to Track Portfolio'),
          ),
        ],
      ),
    );
  }
}

class MarketSummaryCard extends StatelessWidget {
  const MarketSummaryCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Market Summary',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            const Text('S&P 500: 4,567.89 (+1.23%)'),
            const Text('NASDAQ: 14,321.45 (+0.87%)'),
            const Text('DOW: 34,567.12 (+0.45%)'),
          ],
        ),
      ),
    );
  }
}

class StockQuickView extends StatelessWidget {
  const StockQuickView({super.key});

  @override
  Widget build(BuildContext context) {
    final topStocks = [
      Stock('AAPL', 'Apple Inc.', 189.34, 1.23),
      Stock('GOOGL', 'Alphabet Inc.', 145.67, -0.45),
      Stock('TSLA', 'Tesla Inc.', 245.12, 5.67),
    ];

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Top Movers',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            ...topStocks.map((stock) => ListTile(
                  title: Text(stock.symbol),
                  trailing: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text('\$${stock.currentPrice}'),
                      Text(
                        '${stock.change > 0 ? '+' : ''}${stock.change}%',
                        style: TextStyle(
                          color: stock.change > 0 ? Colors.green : Colors.red,
                        ),
                      ),
                    ],
                  ),
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => StockDetailPage(stock: stock),
                    ),
                  ),
                )),
          ],
        ),
      ),
    );
  }
}

class StocksOverviewPage extends StatelessWidget {
  const StocksOverviewPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Text('Stocks Overview Page - TODO: Implement'),
    );
  }
}

class NewsPage extends StatelessWidget {
  const NewsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: const [
        NewsCard(
          title: 'Market Rally Continues',
          summary: 'Stocks rise for third consecutive day...',
          source: 'Financial Times',
        ),
        NewsCard(
          title: 'Tech Stocks Lead Gains',
          summary: 'Major tech companies report strong earnings...',
          source: 'Wall Street Journal',
        ),
      ],
    );
  }
}

class NewsCard extends StatelessWidget {
  final String title;
  final String summary;
  final String source;

  const NewsCard({
    super.key,
    required this.title,
    required this.summary,
    required this.source,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(8.0),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 8),
            Text(summary),
            const SizedBox(height: 8),
            Text(
              source,
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ],
        ),
      ),
    );
  }
}

class PortfolioPage extends StatelessWidget {
  const PortfolioPage({super.key});

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppState>(context);

    if (appState.currentUser == null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('Please sign in to view your portfolio'),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const LoginPage()),
              ),
              child: const Text('Sign In'),
            ),
          ],
        ),
      );
    }

    return ListView(
      children: [
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: Text(
            'Your Portfolio',
            style: Theme.of(context).textTheme.headlineSmall,
          ),
        ),
        ...appState.currentUser!.portfolio.map((stock) => ListTile(
              title: Text(stock.name),
              subtitle: Text(stock.symbol),
              trailing: Text('\$${stock.currentPrice}'),
            )),
      ],
    );
  }
}

class ProVersionPage extends StatelessWidget {
  const ProVersionPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text(
            'Upgrade to Pro Version',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          const Text('Get advanced features:'),
          const SizedBox(height: 8),
          const Text('• Real-time alerts'),
          const Text('• Advanced charts'),
          const Text('• Portfolio analytics'),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () {
              // TODO: Implement purchase flow
            },
            child: const Text('Subscribe for \$9.99/month'),
          ),
        ],
      ),
    );
  }
}

class StockDetailPage extends StatelessWidget {
  final Stock stock;

  const StockDetailPage({super.key, required this.stock});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(stock.symbol),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                stock.name,
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              const SizedBox(height: 8),
              Text(
                '\$${stock.currentPrice}',
                style: Theme.of(context).textTheme.displaySmall,
              ),
              Text(
                '${stock.change > 0 ? '+' : ''}${stock.change}%',
                style: TextStyle(
                  color: stock.change > 0 ? Colors.green : Colors.red,
                  fontSize: 18,
                ),
              ),
              const SizedBox(height: 24),
              const Text(
                'Price Chart',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Container(
                height: 200,
                color: Colors.grey[200],
                child: const Center(
                  child: Text('Chart Placeholder'),
                ),
              ),
              const SizedBox(height: 24),
              const Text(
                'Key Information',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Table(
                children: const [
                  TableRow(
                    children: [
                      Text('High'),
                      Text('\$190.45'),
                    ],
                  ),
                  TableRow(
                    children: [
                      Text('Low'),
                      Text('\$187.56'),
                    ],
                  ),
                  TableRow(
                    children: [
                      Text('Volume'),
                      Text('45.6M'),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 24),
              const Text(
                'Related News',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              const NewsCard(
                title: 'Apple announces new products',
                summary: 'Company unveils latest iPhone and Mac models...',
                source: 'TechCrunch',
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppState>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Sign In'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: _emailController,
                decoration: const InputDecoration(labelText: 'Email'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your email';
                  }
                  return null;
                },
              ),
              TextFormField(
                controller: _passwordController,
                decoration: const InputDecoration(labelText: 'Password'),
                obscureText: true,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your password';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  if (_formKey.currentState!.validate()) {
                    appState.login(User(
                      _emailController.text,
                      'Test User',
                      [
                        Stock('AAPL', 'Apple Inc.', 189.34, 1.23),
                        Stock('GOOGL', 'Alphabet Inc.', 145.67, -0.45),
                      ],
                    ));
                    Navigator.pop(context);
                  }
                },
                child: const Text('Sign In'),
              ),
              TextButton(
                onPressed: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const RegisterPage(),
                  ),
                ),
                child: const Text('Create new account'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class RegisterPage extends StatelessWidget {
  const RegisterPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Register'),
      ),
      body: const Center(
        child: Text('Registration Form - TODO: Implement'),
      ),
    );
  }
}
