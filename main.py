# import logging
import chart

if __name__ == '__main__':
    # logging.basicConfig(level=logging.INFO)
    data = [
            ["A", 637166],
            ["B", 21630],
            ["C", 148662],
            ["D", 78662],
            ["E", 90000]
    ]

    app = chart.create_app(data)
    app.run()
    # strategy.show_back_testing_reports(result)
    # result = pattern_hunter.pattern_hunter(data, pattern=Pattern.doji)
    # pattern_hunter.analyse_pattern(result)
