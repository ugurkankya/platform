<?php declare(strict_types=1);

namespace Shopware\Tests\Unit\Core\Framework\App\Flow\Event\Xml;

use PHPUnit\Framework\TestCase;
use Shopware\Core\Framework\App\Flow\Event\Xml\CustomEvent;
use Symfony\Component\Config\Util\XmlUtils;

/**
 * @internal
 *
 * @covers \Shopware\Core\Framework\App\Flow\Event\Xml\CustomEvent
 */
class CustomEventTest extends TestCase
{
    public function testFromXml(): void
    {
        $doc = XmlUtils::loadFile(
            __DIR__ . '/../../../_fixtures/Resources/flow.xml',
            __DIR__ . '/../../../../../../../../src/Core/Framework/App/Flow/Schema/flow-1.0.xsd'
        );

        $expected = [
            'name' => 'swag.before.open_the_doors',
            'aware' => ['customerAware'],
        ];

        /** @var \DOMElement $events */
        $events = $doc->getElementsByTagName('flow-events')->item(0);
        foreach ($events->getElementsByTagName('flow-event') as $event) {
            $result = CustomEvent::fromXml($event);
            $result = $result->toArray('en-GB');
            static::assertEquals($expected, $result);
        }
    }
}
