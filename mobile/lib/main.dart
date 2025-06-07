import 'package:flutter/material.dart';
import 'package:openapi/api.dart';

/// Flutter code sample for [NavigationBar].

void main() => runApp(const NavigationBarApp());

class NavigationBarApp extends StatelessWidget {
  const NavigationBarApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        theme: ThemeData(useMaterial3: true), home: const NavigationExample());
  }
}

class NavigationExample extends StatefulWidget {
  const NavigationExample({super.key});

  @override
  State<NavigationExample> createState() => _NavigationExampleState();
}

class _NavigationExampleState extends State<NavigationExample> {
  int currentPageIndex = 0;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(
        // TRY THIS: Try changing the color here to a specific color (to
        // Colors.amber, perhaps?) and trigger a hot reload to see the AppBar
        // change color while the other colors stay the same.
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        // Here we take the value from the MyHomePage object that was created by
        // the App.build method, and use it to set our appbar title.
        title: Text("HOME"),
      ),
      bottomNavigationBar: NavigationBar(
        onDestinationSelected: (int index) {
          setState(() {
            currentPageIndex = index;
          });
        },
        indicatorColor: Colors.amber,
        selectedIndex: currentPageIndex,
        destinations: const <Widget>[
          NavigationDestination(
            selectedIcon: Icon(Icons.home),
            icon: Icon(Icons.home_outlined),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Badge(child: Icon(Icons.table_chart)),
            label: 'Stocks',
          ),
          NavigationDestination(
            icon: Badge(child: Icon(Icons.newspaper)),
            label: 'Shitspace',
          ),
          NavigationDestination(
            icon: Badge(label: Text('2'), child: Icon(Icons.history)),
            label: 'Portfolio',
          ),
        ],
      ),
      body: <Widget>[
        /// Home page
        Card(
          shadowColor: Colors.transparent,
          margin: const EdgeInsets.all(8.0),
          child: SizedBox.expand(
            child: Center(
                child: Text('Home page', style: theme.textTheme.titleLarge)),
          ),
        ),

        /// Notifications page
        const Padding(
          padding: EdgeInsets.all(8.0),
          child: Column(
            children: <Widget>[
              Card(
                child: ListTile(
                  leading: Icon(Icons.notifications_sharp),
                  title: Text('Notification 1'),
                  subtitle: Text('This is a notification'),
                ),
              ),
              Card(
                child: ListTile(
                  leading: Icon(Icons.notifications_sharp),
                  title: Text('Notification 2'),
                  subtitle: Text('This is a notification'),
                ),
              ),
            ],
          ),
        ),

        /// news
        Padding(
          padding: EdgeInsets.all(8.0),
          child: Column(
            children: <Widget>[
              HorizontalCardList(),
              // Card(
              //   child: ListTile(
              //     leading: Icon(Icons.notifications_sharp),
              //     title: Text('Notification 2'),
              //     subtitle: Text('This is a notification'),
              //   ),
              // ),
              // const HorizontalCardList(),
              Column(
                children: [
                  Container(
                    // width: 150, // Set a width for each card
                    height: 250,
                    alignment: Alignment.center,
                    //     Card(
                    //       child: ListTile(
                    //         leading: Icon(Icons.stop),
                    //         title: Text('Elon Musk commits suicide'),
                    //         subtitle: Text('He coulnt live anymore'),
                    //       ),
                    //     ),
                    // child: Text(
                    //   items[index],
                    //   style: TextStyle(fontSize: 20),
                    child: Card(
                      child: ListTile(
                        leading: Icon(Icons.stop),
                        title: Text('Elon Musk commits suicide'),
                        subtitle: Text('He coulnt live anymore'),
                      ),
                    ),
                  ),
                  Card(
                    child: ListTile(
                      leading: Icon(Icons.notifications_sharp),
                      title: Text('Notification 2'),
                      subtitle: Text('This is a notification'),
                    ),
                  ),
                ],
              )
            ],
          ),
        ),

        /// Messages page
        ListView.builder(
          reverse: true,
          itemCount: 2,
          itemBuilder: (BuildContext context, int index) {
            if (index == 0) {
              return Align(
                alignment: Alignment.centerRight,
                child: Container(
                  margin: const EdgeInsets.all(8.0),
                  padding: const EdgeInsets.all(8.0),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.primary,
                    borderRadius: BorderRadius.circular(8.0),
                  ),
                  child: Text(
                    'Hello',
                    style: theme.textTheme.bodyLarge!.copyWith(
                      color: theme.colorScheme.onPrimary,
                    ),
                  ),
                ),
              );
            }
            return Align(
              alignment: Alignment.centerLeft,
              child: Container(
                margin: const EdgeInsets.all(8.0),
                padding: const EdgeInsets.all(8.0),
                decoration: BoxDecoration(
                  color: theme.colorScheme.primary,
                  borderRadius: BorderRadius.circular(8.0),
                ),
                child: Text(
                  'Hi!',
                  style: theme.textTheme.bodyLarge!.copyWith(
                    color: theme.colorScheme.onPrimary,
                  ),
                ),
              ),
            );
          },
        ),
      ][currentPageIndex],
    );
  }
}

class HorizontalCardList extends StatelessWidget {
  final List<String> items = List.generate(10, (index) => 'Item $index');

  @override
  Widget build(BuildContext context) {
    // Example of how to use API:
    // final api_instance = DataApi();
    // try {
    //   final result = api_instance.getCharts();
    //   print(result);
    // } catch (e) {
    //   print('Exception when calling DataApi->getCharts: $e\n');
    // }

    // final usr_api = UserApi();
    // try {
    //   final result = usr_api
    //       .login(UserCredentials(usernameSha: "test", passwordSha: "psswd"));
    //   print(result);
    // } catch (e) {
    //   print('Exception when calling DataApi->getCharts: $e\n');
    // }

    return Container(
      height: 50, // Set a height for the horizontal list
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: items.length,
        itemBuilder: (context, index) {
          return Card(
            elevation: 4,
            margin: EdgeInsets.all(8),
            child: Container(
              width: 150, // Set a width for each card
              alignment: Alignment.center,
              //     Card(
              //       child: ListTile(
              //         leading: Icon(Icons.stop),
              //         title: Text('Elon Musk commits suicide'),
              //         subtitle: Text('He coulnt live anymore'),
              //       ),
              //     ),
              child: Text(
                items[index],
                style: TextStyle(fontSize: 20),
              ),
            ),
            // child: ListTile(
            //   leading: Icon(Icons.star), // You can customize the leading icon

            //   title: Text(
            //     items[index],
            //     style: TextStyle(fontSize: 20),
            //   ),
            //   // Optionally, you can add a subtitle
            //   subtitle: Text('Subtitle for ${items[index]}'),
            // ),
          );
        },
      ),
    );
  }
}
