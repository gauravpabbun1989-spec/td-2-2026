"""Regression tests for the production TicketDepart inbound dialplan."""
import re
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

DIALPLAN = Path(__file__).with_name("01_ticketdepart_inbound.xml")


class InboundDialplanTests(unittest.TestCase):
    def setUp(self):
        self.root = ET.parse(DIALPLAN).getroot()
        self.extension = self.root.find("./extension[@name='ticketdepart_telxio_inbound']")
        self.assertIsNotNone(self.extension)

    def test_gateway_condition_uses_channel_variable_expansion(self):
        condition = self.extension.find("./condition")
        self.assertIsNotNone(condition)
        self.assertEqual(condition.get("field"), "${sip_gateway}")
        self.assertEqual(condition.get("expression"), "^telxio$")

    def test_only_dedicated_telxio_gateway_routes_to_internal_ring_monitor(self):
        gateway_condition = self.extension.find("./condition")
        self.assertIsNotNone(gateway_condition)
        self.assertEqual(gateway_condition.get("field"), "${sip_gateway}")
        pattern = gateway_condition.get("expression")
        self.assertTrue(re.fullmatch(pattern, "telxio"))
        self.assertFalse(re.fullmatch(pattern, "other-provider"))
        self.assertFalse(re.fullmatch(pattern, ""))
        actions = gateway_condition.findall("./action")
        self.assertEqual(
            [(action.get("application"), action.get("data")) for action in actions],
            [("transfer", "1001 XML default")],
        )
        self.assertIsNone(gateway_condition.find("./condition"))


if __name__ == "__main__":
    unittest.main()
