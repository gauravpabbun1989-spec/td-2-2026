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

    def test_only_current_ticketdepart_destinations_route_to_agent_1001(self):
        gateway_condition = self.extension.find("./condition")
        destination_condition = gateway_condition.find("./condition")
        self.assertIsNotNone(destination_condition)
        self.assertEqual(destination_condition.get("field"), "destination_number")
        pattern = destination_condition.get("expression")
        self.assertTrue(re.fullmatch(pattern, "1030605"))
        self.assertTrue(re.fullmatch(pattern, "18885649049"))
        self.assertTrue(re.fullmatch(pattern, "+18885649049"))
        self.assertFalse(re.fullmatch(pattern, "+18777888010"))
        actions = destination_condition.findall("./action")
        self.assertEqual(
            [(action.get("application"), action.get("data")) for action in actions],
            [("transfer", "1001 XML default")],
        )


if __name__ == "__main__":
    unittest.main()
