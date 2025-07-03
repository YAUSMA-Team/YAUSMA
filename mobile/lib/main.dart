import 'package:flutter/material.dart';
import 'package:openapi/api.dart';
import 'package:provider/provider.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:url_launcher/url_launcher.dart';

var client = ApiClient(basePath: "https://yausma.org");

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
  final double high;
  final double low;
  final String volume;
  final String sector;
  final String description;

  Stock(
    this.symbol,
    this.name,
    this.currentPrice,
    this.change, {
    this.high = 0,
    this.low = 0,
    this.volume = '',
    this.sector = '',
    this.description = '',
  });
}

class NewsArticle {
  final String id;
  final String title;
  final String summary;
  final String source;
  final String content;
  final String date;
  final String? imageUrl;

  const NewsArticle({
    required this.id,
    required this.title,
    required this.summary,
    required this.source,
    required this.content,
    required this.date,
    this.imageUrl,
  });
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
    return FutureBuilder<List<MarketOverviewItem>>(
        future: DataApi(client)
            .getMarketOverview()
            .then((value) => value ?? []), // call your async function here
        builder: (context, snapshot) {
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
                  ...(snapshot.data ?? []).map((stock) => Card(
                        // ...stocks.map((stock) => Card(
                        margin: const EdgeInsets.symmetric(
                            horizontal: 16.0, vertical: 8.0),
                        child: ListTile(
                          title: Text(stock.name),
                          subtitle: Text(stock.sector),
                          trailing: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text('${stock.currentPrice}'),
                              Text(
                                '${stock.change > 0 ? '+' : ''}${stock.change}%',
                                style: TextStyle(
                                  color: stock.change > 0
                                      ? Colors.green
                                      : Colors.red,
                                ),
                              ),
                            ],
                          ),
                          onTap: () => Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) =>
                                  StockDetailPage(stock: stock),
                            ),
                          ),
                        ),
                      )),
                ],
              ),
            ),
          );
        });
  }
}

class StocksOverviewPage extends StatelessWidget {
  const StocksOverviewPage({super.key});
  // Your async function

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<MarketOverviewItem>>(
        future: DataApi(client)
            .getMarketOverview()
            .then((value) => value ?? []), // call your async function here
        builder: (context, snapshot) {
          return ListView(
            children: [
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Text(
                  'Stock Market Overview',
                  style: Theme.of(context).textTheme.headlineSmall,
                ),
              ),
              ...(snapshot.data ?? []).map((stock) => Card(
                    // ...stocks.map((stock) => Card(
                    margin: const EdgeInsets.symmetric(
                        horizontal: 16.0, vertical: 8.0),
                    child: ListTile(
                      title: Text(stock.name),
                      subtitle: Text(stock.sector),
                      trailing: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text('${stock.currentPrice}'),
                          Text(
                            '${stock.change > 0 ? '+' : ''}${stock.change}%',
                            style: TextStyle(
                              color:
                                  stock.change > 0 ? Colors.green : Colors.red,
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
                    ),
                  )),
            ],
          );
        });
  }
  // );
}

class NewsPage extends StatelessWidget {
  const NewsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final newsArticles = [
      const NewsArticle(
        id: '1',
        title: 'Market Rally Continues',
        summary: 'Stocks rise for third consecutive day...',
        source: 'Financial Times',
        content:
            'Global markets continued their upward trend for the third consecutive day, with the S&P 500 gaining 1.2% and the NASDAQ up 1.8%. Analysts attribute the rally to positive earnings reports from major tech companies and easing inflation concerns. The Dow Jones Industrial Average also rose 0.8%, marking its best performance this month.',
        date: '2023, 6, 15, 10, 30',
        // imageUrl: 'https://example.com/news1.jpg',
      ),
      const NewsArticle(
          id: '2',
          title: 'Tech Stocks Lead Gains',
          summary: 'Major tech companies report strong earnings...',
          source: 'Wall Street Journal',
          content:
              'Technology stocks outperformed the broader market yesterday, with the tech-heavy NASDAQ index closing up 2.3%. Apple, Microsoft, and Alphabet all reported better-than-expected quarterly earnings, driving the sector higher. Analysts suggest this could signal a rotation back into growth stocks after months of underperformance.',
          date: '2023, 6, 14, 15, 45'),
      const NewsArticle(
          id: '3',
          title: 'Tech Stocks Lead Gains',
          summary: 'Major tech companies report strong earnings...',
          source: 'Wall Street Journal',
          content:
              'Technology stocks outperformed the broader market yesterday, with the tech-heavy NASDAQ index closing up 2.3%. Apple, Microsoft, and Alphabet all reported better-than-expected quarterly earnings, driving the sector higher. Analysts suggest this could signal a rotation back into growth stocks after months of underperformance.',
          date: '2023, 6, 14, 15, 45'),
    ];

    return FutureBuilder<List<NewsItem>>(
        future: DataApi(client)
            .getNews()
            .then((value) => value ?? []), // call your async function here
        builder: (context, snapshot) {
          return ListView(
            children: [
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Text(
                  'Latest Market News',
                  style: Theme.of(context).textTheme.headlineSmall,
                ),
              ),
              ...(snapshot.data ?? []).map((news) => NewsCard(
                    article: news,
                    onTap: () => {},
                  )),
            ],
          );
        });
  }
}

class NewsCard extends StatelessWidget {
  final NewsItem article;
  final VoidCallback onTap;

  const NewsCard({
    super.key,
    required this.article,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: const Icon(Icons.link), // External link icon
        title: Text(article.title),
        subtitle: Text(article.publisher),
        trailing:
            const Icon(Icons.open_in_new), // Optional: Indicates external link
        onTap: () async {
          await launchUrl(Uri.parse(article.source_));
          // if (await canLaunchUrl(Uri.parse(article.source_))) {
          // } else {
          //   var src = article.source_;
          //   Fluttertoast.showToast(
          //     msg: 'Could not launch $src',
          //     toastLength: Toast.LENGTH_SHORT, // 2 seconds
          //     gravity: ToastGravity.BOTTOM,
          //     timeInSecForIosWeb: 2, // duration for iOS/web
          //     backgroundColor: Colors.red,
          //     textColor: Colors.white,
          //     fontSize: 16.0,
          //   );
          // }
        },
      ),
    );

    // return Card(
    //   margin: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
    //   child: InkWell(
    //     onTap: onTap,
    //     child: Padding(
    //       padding: const EdgeInsets.all(12.0),
    //       child: Column(
    //         crossAxisAlignment: CrossAxisAlignment.start,
    //         children: [
    //           // if (article.imageUrl != null)
    //           //   Container(
    //           //     height: 150,
    //           //     decoration: BoxDecoration(
    //           //       image: DecorationImage(
    //           //         image: NetworkImage(article.imageUrl!),
    //           //         fit: BoxFit.cover,
    //           //       ),
    //           //       borderRadius: BorderRadius.circular(4.0),
    //           //     ),
    //           //   ),
    //           const SizedBox(height: 8),
    //           Text(
    //             article.title,
    //             style: Theme.of(context).textTheme.titleLarge,
    //           ),
    //           const SizedBox(height: 4),
    //           // Text(
    //           //   article.summary,
    //           //   style: Theme.of(context).textTheme.bodyMedium,
    //           // ),
    //           const SizedBox(height: 8),
    //           Row(
    //             mainAxisAlignment: MainAxisAlignment.spaceBetween,
    //             children: [
    //               // Text(
    //               //   article.source,
    //               //   style: Theme.of(context).textTheme.bodySmall,
    //               // ),
    //               Text(
    //                 'Published: ${article.date}',
    //                 style: Theme.of(context).textTheme.bodySmall,
    //               ),
    //             ],
    //           ),
    //         ],
    //       ),
    //     ),
    //   ),
    // );
  }
}

class NewsDetailPage extends StatelessWidget {
  final NewsArticle article;

  const NewsDetailPage({super.key, required this.article});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(article.source),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              article.title,
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(
              'Published: ${article.date.toString().substring(0, 16)}',
              style: Theme.of(context).textTheme.bodySmall,
            ),
            const SizedBox(height: 16),
            if (article.imageUrl != null)
              Container(
                height: 200,
                decoration: BoxDecoration(
                  image: DecorationImage(
                    image: NetworkImage(article.imageUrl!),
                    fit: BoxFit.cover,
                  ),
                  borderRadius: BorderRadius.circular(8.0),
                ),
              ),
            const SizedBox(height: 16),
            Text(
              article.content,
              style: Theme.of(context).textTheme.bodyLarge,
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
        Text('Nothing here yet.'),
        // ...appState.currentUser!.portfolio.map((stock) => Card(
        //       margin:
        //           const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
        //       child: ListTile(
        //         title: Text(stock.name),
        //         subtitle: Text(stock.symbol),
        //         trailing: Column(
        //           mainAxisAlignment: MainAxisAlignment.center,
        //           crossAxisAlignment: CrossAxisAlignment.end,
        //           children: [
        //             Text('\$${stock.currentPrice}'),
        //             Text(
        //               '${stock.change > 0 ? '+' : ''}${stock.change}%',
        //               style: TextStyle(
        //                 color: stock.change > 0 ? Colors.green : Colors.red,
        //               ),
        //             ),
        //           ],
        //         ),
        //         // onTap: () => Navigator.push(
        //         //   context,
        //         //   MaterialPageRoute(
        //         //     builder: (context) => StockDetailPage(stock: stock),
        //         //   ),
        //         // ),
        //       ),
        //     )),
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
            'Upgrade to Ulta-Pro-Global-Elite-Boss-Mega-Max Version',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          const Text('Get no advanced features:'),
          const SizedBox(height: 8),
          const Text('• Pay us money (does not work lol)'),
          const Text('• We will give you nothing in return'),
          const Text('• Just use Ghostfolio'),
          const Text('• What are you even doing here?'),
          const Text('• Help meeee!!!!'),
          const Text('• THEY KEEP ME HERE AGAINST MY WILL!!!'),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () {
              Fluttertoast.showToast(
                msg:
                    "Thank you for wasting money on us. We are absolutely not sorry",
                toastLength: Toast.LENGTH_LONG, // 2 seconds
                gravity: ToastGravity.CENTER,
                timeInSecForIosWeb: 4, // duration for iOS/web
                backgroundColor: Colors.pink,
                textColor: Colors.white,
                fontSize: 16.0,
              );
              // TODO: Implement purchase flow
            },
            child: const Text('Subscribe only for 1.99 BTC/month'),
          ),
          const SizedBox(height: 16),
          TextButton(
            onPressed: () {},
            child: const Text('Restore Purchase'),
          ),
        ],
      ),
    );
  }
}

class StockDetailPage extends StatelessWidget {
  final MarketOverviewItem stock;

  const StockDetailPage({super.key, required this.stock});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(stock.name),
      ),
      body: SingleChildScrollView(
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
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: BorderRadius.circular(8.0),
              ),
              child: const Center(
                child: Text('Interactive Chart Placeholder'),
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'Key Information',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Table(
              border: TableBorder.all(color: Colors.grey),
              children: [
                TableRow(
                  children: [
                    const Padding(
                      padding: EdgeInsets.all(8.0),
                      child: Text('High'),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Text('\$${stock.high}'),
                    ),
                  ],
                ),
                TableRow(
                  children: [
                    const Padding(
                      padding: EdgeInsets.all(8.0),
                      child: Text('Low'),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Text('\$${stock.low}'),
                    ),
                  ],
                ),
                TableRow(
                  children: [
                    const Padding(
                      padding: EdgeInsets.all(8.0),
                      child: Text('Volume'),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Text(stock.volume.toString()),
                    ),
                  ],
                ),
                TableRow(
                  children: [
                    const Padding(
                      padding: EdgeInsets.all(8.0),
                      child: Text('Sector'),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Text(stock.sector),
                    ),
                  ],
                ),
              ],
            ),
            // if (stock.description.isNotEmpty) ...[
            //   const SizedBox(height: 24),
            //   const Text(
            //     'Company Description',
            //     style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            //   ),
            //   const SizedBox(height: 8),
            //   Text(stock.description),
            // ],
            const SizedBox(height: 24),
            const Text(
              'Related News',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            if (stock.newsArticle != null)
              NewsCard(
                article: stock.newsArticle!,
                onTap: () {},
              )
          ],
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
  String _email = "";
  String _password = "";

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
                    return 'Please enter email';
                  }
                  if (!value.contains('@')) {
                    return 'Please enter a valid email';
                  }
                  this._email = value ?? "";
                  return null;
                },
              ),
              TextFormField(
                controller: _passwordController,
                decoration: const InputDecoration(labelText: 'Password'),
                obscureText: true,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter password';
                  }
                  if (value.length < 6) {
                    return 'Password must be at least 6 characters';
                  }
                  this._password = value ?? "";
                  return null;
                },
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () async {
                  if (_formKey.currentState!.validate()) {
                    var res = await UserApi(client).loginWithHttpInfo(
                        UserCredentials(
                            email: this._email, passwordHash: this._password));

                    var r = res.body;
                    print('BEFORE $r');

                    if (res.statusCode != 200) {
                      Fluttertoast.showToast(
                        msg: res.body,
                        toastLength: Toast.LENGTH_SHORT, // 2 seconds
                        gravity: ToastGravity.BOTTOM,
                        timeInSecForIosWeb: 2, // duration for iOS/web
                        backgroundColor: Colors.red,
                        textColor: Colors.white,
                        fontSize: 16.0,
                      );

                      return;
                    }

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

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final confirmPasswordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    // Dispose controllers when the widget is disposed
    emailController.dispose();
    passwordController.dispose();
    confirmPasswordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppState>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Register'),
      ),
      body: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: _formKey,
            child: Column(
              children: [
                TextFormField(
                  controller: emailController,
                  decoration: const InputDecoration(
                      labelText: 'Email (accepted only fake ones)'),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Ghosts cant register, bud';
                    }
                    if (!value.contains('@')) {
                      return 'You will need to have atleast @ to bypass this form';
                    }
                    return null;
                  },
                ),
                TextFormField(
                  controller: passwordController,
                  decoration: const InputDecoration(labelText: 'Password'),
                  obscureText: true,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your password (123456 is fine)';
                    }
                    if (value.length < 6) {
                      return 'Password must be at least 6 characters (just use 123456)';
                    }
                    return null;
                  },
                ),
                TextFormField(
                  controller: confirmPasswordController,
                  decoration:
                      const InputDecoration(labelText: 'Confirm Password'),
                  obscureText: true,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your password';
                    }
                    if (value.length < 6) {
                      return 'Password must be at least 6 characters';
                    }
                    if (passwordController.text != value) {
                      return 'Passwords do not match';
                    }

                    return null;
                  },
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () async {
                    if (_formKey.currentState!.validate()) {
                      // Access the input values
                      final email = emailController.text;
                      final password = passwordController.text;
                      final confirmPassword = confirmPasswordController.text;

                      // TODO: Implement registration logic here
                      print('Email: $email');
                      print('Password: $password');
                      print('Confirm Password: $confirmPassword');

                      var res = await UserApi(client).signupWithHttpInfo(
                          UserCredentials(
                              email: email, passwordHash: password));

                      var r = res.body;
                      print('Res: $r');

                      if (res.statusCode != 200) {
                        Fluttertoast.showToast(
                          msg: res.body,
                          toastLength: Toast.LENGTH_SHORT, // 2 seconds
                          gravity: ToastGravity.BOTTOM,
                          timeInSecForIosWeb: 2, // duration for iOS/web
                          backgroundColor: Colors.red,
                          textColor: Colors.white,
                          fontSize: 16.0,
                        );
                        return;
                      } else {
                        Navigator.pop(context);
                      }
                    }
                  },
                  child: const Text('Register'),
                ),
              ],
            ),
          )),
    );
  }
}
